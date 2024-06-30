import {
  Custom_error,
  Custom_response,
  async_error_handler,
  checkPasswords,
  createJwt,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { BuyerModelPerma } from '../../../../models/buyer/schema/buyerPerma';
import { requestWithPermaBuyer, roles } from '../../../../types/types';
import { SessionModel } from '../../../../models/sessions/schema/sesssions';
const login: sync_middleware_type = async_error_handler(
  async (req: requestWithPermaBuyer, res, next) => {
    const { email, password } = req.body;
    if (!email || !password)
      throw new Custom_error({
        errors: [{ message: 'invalidEmailOrPassword' }],
        statusCode: 400,
      });
    const permaUser = await BuyerModelPerma.findOne({ email }).select(
      '+password'
    );
    console.log(permaUser);
    if (!permaUser)
      throw new Custom_error({
        errors: [{ message: 'invalidEmailOrPassword' }],
        statusCode: 403,
      });
    const isPasswordCorrect = await checkPasswords(
      password,
      permaUser.password
    );
    if (!isPasswordCorrect)
      throw new Custom_error({
        errors: [{ message: 'invalidEmailOrPassword' }],
        statusCode: 403,
      });
    const accessToken = await createJwt(
      {
        payload: { _id: permaUser._id, role: roles.BUYER },
        options: {
          expiresIn: process.env.ACCESS_TOKEN_TIME,
        },
      },
      process.env.ACCESS_TOKEN_SECRET!
    );
    const refreshToken: string = (await createJwt(
      {
        payload: { _id: permaUser._id, role: roles.BUYER },
        options: {
          expiresIn: process.env.REFRESH_TOKEN_TIME,
        },
      },
      process.env.REFRESH_TOKEN_SECRET!
    )) as string;
    const session = SessionModel.build({
      operatingSystem: req.device?.operatingSystem!,
      deviceFingerprint: req.device!.deviceFingerprint!,
      refreshToken: refreshToken,
    });
    await session.save();
    await BuyerModelPerma.findByIdAndUpdate(permaUser._id, {
      $push: { sessions: session._id },
    });
    const response = new Custom_response(
      true,
      null,
      { refreshToken, accessToken, user: permaUser },
      'success',
      200,
      null
    );
    res.status(response.statusCode).json(response);
  }
);
export { login };
