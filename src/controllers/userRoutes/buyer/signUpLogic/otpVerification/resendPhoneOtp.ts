import {
  Custom_error,
  Custom_response,
  async_error_handler,
  createJwt,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { requestWithTempBuyer, roles } from '../../../../../types/types';
import {
  BuyerModelTemp,
  calculateExpiry,
} from '../../../../../models/buyer/schema/buyerTemp';
import { sendOtpViaPhone } from '../helpers/sendOtpViaPhone';

const resendPhoneOtp: sync_middleware_type = async_error_handler(
  async (req: requestWithTempBuyer, res, next) => {
    const { name, email, phoneNumber, password } = req.buyer!;
    if (req.buyer?.phoneOtp.otpSentTimes! >= 3)
      throw new Custom_error({
        errors: [{ message: 'tryAfterSomeTime' }],
        statusCode: 400,
      });
    const phoneOtp = await sendOtpViaPhone(name, email, phoneNumber);
    const jwtForOtp = await createJwt(
      {
        payload: { _id: req.buyer!._id, role: roles.BUYER },
        options: { expiresIn: process.env.SIGNUP_OTP_TIME },
      },
      process.env.JWT_SIGNUP_OTP_SECRET!
    );
    await BuyerModelTemp.updateOne(
      { phoneNumber },
      {
        $set: {
          'phoneOtp.otp': phoneOtp,
          'phoneOtp.createdAt': Date.now(),
          'phoneOtp.expiresAt': calculateExpiry(),
          'phoneOtp.otpSentTimes': req.buyer!.phoneOtp.otpSentTimes! + 1,
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
