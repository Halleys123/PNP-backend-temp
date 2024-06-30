import {
  Custom_error,
  Custom_response,
  async_error_handler,
  createJwt,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { requestWithTempAdmin, roles } from '../../../../../types/types';
import {
  AdminModelTemp,
  calculateExpiry,
} from '../../../../../models/admin/schema/adminTemp';
import { sendOtpViaPhone } from '../helpers/sendOtpViaPhone';

const resendOtp: sync_middleware_type = async_error_handler(
  async (req: requestWithTempAdmin, res, next) => {
    const { name, email, phoneNumber } = req.admin!;
    if (req.admin?.otpSentTimes! >= 3)
      throw new Custom_error({
        errors: [{ message: 'tryAfterSomeTime' }],
        statusCode: 400,
      });
    const phoneOtp = await sendOtpViaPhone(name, email, phoneNumber);
    const jwtForOtp = await createJwt(
      {
        payload: { _id: req.admin!._id, role: roles.BUYER },
        options: { expiresIn: process.env.SIGNUP_OTP_TIME },
      },
      process.env.JWT_SIGNUP_OTP_SECRET!
    );
    await AdminModelTemp.updateOne(
      { phoneNumber },
      {
        $set: {
          otp: phoneOtp,
          createdAt: Date.now(),
          expiresAt: calculateExpiry(),
          otpSentTimes: req.admin!.otpSentTimes! + 1,
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
export { resendOtp };
