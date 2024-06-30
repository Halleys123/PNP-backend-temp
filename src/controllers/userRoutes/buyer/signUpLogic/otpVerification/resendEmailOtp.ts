import {
  Custom_error,
  Custom_response,
  async_error_handler,
  createJwt,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { requestWithTempBuyer, roles } from '../../../../../types/types';
import { sendOtpViaEmail } from '../helpers/sendOtpViaEmail';
import {
  BuyerModelTemp,
  calculateExpiry,
} from '../../../../../models/buyer/schema/buyerTemp';

const resendEmailOtp: sync_middleware_type = async_error_handler(
  async (req: requestWithTempBuyer, res, next) => {
    const { name, email, phoneNumber, password } = req.buyer!;
    if (req.buyer?.emailOtp.otpSentTimes! >= 3)
      throw new Custom_error({
        errors: [{ message: 'tryAfterSomeTime' }],
        statusCode: 400,
      });
    const emailOtp = await sendOtpViaEmail(name, email, phoneNumber);
    const jwtForOtp = await createJwt(
      {
        payload: { _id: req.buyer!._id, role: roles.BUYER },
        options: { expiresIn: process.env.SIGNUP_OTP_TIME },
      },
      process.env.JWT_SIGNUP_OTP_SECRET!
    );
    await BuyerModelTemp.updateOne(
      { email },
      {
        $set: {
          'emailOtp.otp': emailOtp,
          'emailOtp.createdAt': Date.now(),
          'emailOtp.expiresAt': calculateExpiry(),
          'emailOtp.otpSentTimes': req.buyer!.emailOtp.otpSentTimes! + 1,
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
export { resendEmailOtp };
