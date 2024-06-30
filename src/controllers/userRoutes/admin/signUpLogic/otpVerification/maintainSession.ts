import {
  Custom_response,
  async_error_handler,
  createJwt,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { AdminModelPerma } from '../../../../../models/admin/schema/adminPerma';
import { AdminModelTemp } from '../../../../../models/admin/schema/adminTemp';
import { requestWithTempAdmin, roles } from '../../../../../types/types';
import { SessionModel } from '../../../../../models/sessions/schema/sesssions';
const maintainSession: sync_middleware_type = async_error_handler(
  async (req: requestWithTempAdmin, res, next) => {
    const { name, email, password, phoneNumber, designation } = req.admin!;
    const permaUser = AdminModelPerma.build({
      name,
      email,
      password,
      phoneNumber,
      designation,
    });

    await permaUser.save();
    await AdminModelTemp.findByIdAndDelete(req.admin!._id);
    const accessToken = await createJwt(
      {
        payload: { _id: permaUser._id },
        options: {
          expiresIn: process.env.ACCESS_TOKEN_TIME,
        },
      },
      process.env.ACCESS_TOKEN_SECRET!
    );
    const refreshToken: string = (await createJwt(
      {
        payload: { _id: permaUser._id },
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
    await AdminModelPerma.findByIdAndUpdate(permaUser._id, {
      $push: { sessions: session._id },
    });
    const response = new Custom_response(
      true,
      null,
      { refreshToken, accessToken },
      'success',
      200,
      null
    );
    res.status(response.statusCode).json(response);
    return;
  }
);
export { maintainSession };
