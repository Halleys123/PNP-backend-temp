import {
  Custom_error,
  Custom_response,
  async_error_handler,
  checkPasswords,
  hashPassword,
  jwtVerification,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { BuyerForgotPasswordTempModel } from '../../../../../models/buyer/schema/buyerForgotPasswordTemp';
import {
  requestWithDeviceFingerprint,
  requestWithForgotPasswordBuyer,
} from '../../../../../types/types';
import { BuyerModelPerma } from '../../../../../models/buyer/schema/buyerPerma';

const changeForgotPassword: sync_middleware_type = async_error_handler(
  async (req: requestWithForgotPasswordBuyer, res, next) => {
    const jwt: string = req.headers.authentication as string;
    if (!jwt)
      throw new Custom_error({
        errors: [{ message: 'noJwt' }],
        statusCode: 400,
      });
    if (!jwt.startsWith('Bearer'))
      throw new Custom_error({
        errors: [{ message: 'invalidToken' }],
        statusCode: 401,
      });
    const token: string = jwt.split(' ')[1];
    const tokenInfo = (await jwtVerification(
      token,
      process.env.CHANGE_PASSWORD_SECRET!
    )) as { _id: string };
    const foundUser = await BuyerForgotPasswordTempModel.findById(
      tokenInfo._id
    );
    if (!foundUser)
      throw new Custom_error({
        errors: [{ message: 'noSuchUser' }],
        statusCode: 404,
      });
    const matchedFingerprint = await checkPasswords(
      req.device!.deviceFingerprint!,
      foundUser.deviceFingerprint
    );
    if (!matchedFingerprint)
      throw new Custom_error({
        errors: [{ message: 'initiatedSignUpFromSomeOtherDevice' }],
        statusCode: 401,
      });
    const { newPassword } = req.body;
    if (!newPassword)
      throw new Custom_error({
        errors: [{ message: 'sendANewPassword' }],
        statusCode: 400,
      });
    const buyer = await BuyerModelPerma.findByIdAndUpdate(foundUser.buyerId, {
      $set: { password: await hashPassword(newPassword) },
    });
    console.log(req.forgotPasswordBuyer);
    await BuyerForgotPasswordTempModel.findByIdAndDelete(foundUser._id);
    req.buyer = buyer!;
    next();
  }
);
export { changeForgotPassword };
