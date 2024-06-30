import {
  Custom_error,
  Custom_response,
  async_error_handler,
  createJwt,
} from '@himanshu_guptaorg/utils';
import { requestWithForgotPasswordAdmin } from '../../../../../types/types';
import { sendOtpViaEmail } from './helpers/sendOtpViaEmail';
import { AdminModelPerma } from '../../../../../models/admin/schema/adminPerma';
import {
  AdminForgotPasswordTempModel,
  calculateExpiry,
} from '../../../../../models/admin/schema/adminForgotPasswordTemp';
import { sendOtpViaPhone } from './helpers/sendOtpViaPhone';

const resendForgotPasswordOtp = async_error_handler(
  async (req: requestWithForgotPasswordAdmin, res, next) => {
    const admin = await AdminModelPerma.findById(
      req.forgotPasswordAdmin!.adminId
    );
    if (!admin)
      throw new Custom_error({
        errors: [{ message: 'noSuchUser' }],
        statusCode: 404,
      });
    if (req.forgotPasswordAdmin!.isExpired)
      throw new Custom_error({
        errors: [{ message: 'otpExpired' }],
        statusCode: 401,
      });
    if (req.forgotPasswordAdmin!.otpSentTimes == 3) {
      throw new Custom_error({
        errors: [{ message: 'tryAfterSomeTime' }],
        statusCode: 400,
      });
    }
    let otp: string;
    console.log('himanshu');
    if (req.forgotPasswordAdmin!.isEmail) {
      otp = await sendOtpViaEmail(admin.name, admin.email, admin.phoneNumber);
    } else {
      otp = await sendOtpViaPhone(admin.name, admin.email, admin.phoneNumber);
    }
    const jwt = await createJwt(
      {
        payload: { _id: req.forgotPasswordAdmin!._id },
        options: { expiresIn: process.env.MAX_PASSWORD_CHANGE_TIME! },
      },
      process.env.FORGOT_PASSWORD_OTP_SECRET!
    );
    await AdminForgotPasswordTempModel.findByIdAndUpdate(
      req.forgotPasswordAdmin!._id,
      {
        $set: {
          otp: otp,
          otpJwt: jwt,
          expiresAt: calculateExpiry(),
          createdAt: Date.now(),
          otpSentTimes: req.forgotPasswordAdmin?.otpSentTimes! + 1,
        },
      }
    );
    const response = new Custom_response(
      true,
      null,
      { token: jwt },
      'success',
      200,
      null
    );
    res.status(response.statusCode).json(response);
  }
);
export { resendForgotPasswordOtp };
