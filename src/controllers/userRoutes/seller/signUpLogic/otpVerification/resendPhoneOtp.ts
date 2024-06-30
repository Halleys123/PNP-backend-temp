import {
  Custom_error,
  Custom_response,
  async_error_handler,
  createJwt,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { requestWithTempSeller, roles } from '../../../../../types/types';
import {
  SellerModelTemp,
  calculateExpiry,
} from '../../../../../models/seller/schema/sellerTemp';
import { sendOtpViaPhone } from '../helpers/sendOtpViaPhone';

const resendPhoneOtp: sync_middleware_type = async_error_handler(
  async (req: requestWithTempSeller, res, next) => {
    const { name, email, phoneNumber, address, password } = req.seller!;
    if (req.seller?.phoneOtp.otpSentTimes! >= 3)
      throw new Custom_error({
        errors: [{ message: 'tryAfterSomeTime' }],
        statusCode: 400,
      });
    const phoneOtp = await sendOtpViaPhone(name, email, phoneNumber, address);
    const jwtForOtp = await createJwt(
      {
        payload: { _id: req.seller!._id, role: roles.BUYER },
        options: { expiresIn: process.env.SIGNUP_OTP_TIME },
      },
      process.env.JWT_SIGNUP_OTP_SECRET!
    );
    await SellerModelTemp.updateOne(
      { phoneNumber },
      {
        $set: {
          'phoneOtp.otp': phoneOtp,
          'phoneOtp.createdAt': Date.now(),
          'phoneOtp.expiresAt': calculateExpiry(),
          'phoneOtp.otpSentTimes': req.seller!.phoneOtp.otpSentTimes! + 1,
          otpJwt: jwtForOtp,
        },
      }
    );
    const response = new Custom_response(
      true,
      null,
      { token: jwtForOtp },
      'success',
      201,
      null
    );
    res.status(response.statusCode).json(response);
  }
);
export { resendPhoneOtp };
