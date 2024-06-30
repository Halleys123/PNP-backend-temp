import {
  Custom_response,
  async_error_handler,
  createJwt,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { SellerModelPerma } from '../../../../../models/seller/schema/sellerPerma';
import { SellerModelTemp } from '../../../../../models/seller/schema/sellerTemp';
import { requestWithTempSeller, roles } from '../../../../../types/types';
import { SessionModel } from '../../../../../models/sessions/schema/sesssions';
const maintainSession: sync_middleware_type = async_error_handler(
  async (req: requestWithTempSeller, res, next) => {
    const {
      name,
      email,
      password,
      phoneNumber,
      address,
      bankAccount,
      accountInfo,
    } = req.seller!;
    if (req.seller!.phoneOtp.isVerified && req.seller!.emailOtp.isVerified) {
      const permaUser = SellerModelPerma.build({
        name,
        email,
        password,
        phoneNumber,
        address,
        bankAccount,
        accountInfo,
      });
      await permaUser.save();
      await SellerModelTemp.findByIdAndDelete(req.seller!._id);
      const accessToken = await createJwt(
        {
          payload: { _id: permaUser._id, role: roles.SELLER },
          options: {
            expiresIn: process.env.ACCESS_TOKEN_TIME,
          },
        },
        process.env.ACCESS_TOKEN_SECRET!
      );
      const refreshToken: string = (await createJwt(
        {
          payload: { _id: permaUser._id, role: roles.SELLER },
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
      await SellerModelPerma.findByIdAndUpdate(permaUser._id, {
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
    } else if (req.seller?.emailOtp.isVerified) {
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
