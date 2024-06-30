import {
  Custom_response,
  async_error_handler,
  createJwt,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { BuyerModelPerma } from '../../../../../models/buyer/schema/buyerPerma';
import { BuyerModelTemp } from '../../../../../models/buyer/schema/buyerTemp';
import { requestWithTempBuyer, roles } from '../../../../../types/types';
import { SessionModel } from '../../../../../models/sessions/schema/sesssions';
const maintainSession: sync_middleware_type = async_error_handler(
  async (req: requestWithTempBuyer, res, next) => {
    const { name, email, password, phoneNumber } = req.buyer!;
    if (req.buyer!.phoneOtp.isVerified && req.buyer!.emailOtp.isVerified) {
      const permaUser = BuyerModelPerma.build({
        name,
        email,
        password,
        phoneNumber,
      });
      await permaUser.save();
      await BuyerModelTemp.findByIdAndDelete(req.buyer!._id);
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
      return;
    } else if (req.buyer?.emailOtp.isVerified) {
      const response = new Custom_response(
        true,
        null,
        'emailSuccessfullyVerified',
        'success',
        200,
        null
      );
      res.status(response.statusCode).json(response);
      return;
    } else {
      const response = new Custom_response(
        true,
        null,
        'phoneSuccessfullyVerified',
        'success',
        200,
        null
      );
      res.status(response.statusCode).json(response);
      return;
    }
  }
);
export { maintainSession };
