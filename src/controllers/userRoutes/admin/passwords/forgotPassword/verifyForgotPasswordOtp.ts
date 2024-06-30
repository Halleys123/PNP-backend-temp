import {
  Custom_error,
  Custom_response,
  async_error_handler,
  createJwt,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { requestWithForgotPasswordAdmin } from '../../../../../types/types';
import { checkOtp } from '../../../../../utils/otp/generateOtp';
import { AdminForgotPasswordTempModel } from '../../../../../models/admin/schema/adminForgotPasswordTemp';

const verifyForgotPasswordOtp: sync_middleware_type = async_error_handler(
  async (req: requestWithForgotPasswordAdmin, res, next) => {
    const { otp } = req.body;
    if (!otp)
      throw new Custom_error({
        errors: [{ message: 'noOtpSent' }],
        statusCode: 400,
      });

    if (req.forgotPasswordAdmin!.isExpired)
      throw new Custom_error({
        errors: [{ message: 'otpExpired' }],
        statusCode: 401,
      });
    if (!(await checkOtp(otp, req.forgotPasswordAdmin!.otp!))) {
      throw new Custom_error({
        errors: [{ message: 'otpMismatch' }],
        statusCode: 400,
      });
    }
    const changePasswordJwt = await createJwt(
      {
        payload: { _id: req.forgotPasswordAdmin!._id },
        options: { expiresIn: process.env.MAX_PASSWORD_CHANGE_TIME },
      },
      process.env.CHANGE_PASSWORD_SECRET!
    );
    await AdminForgotPasswordTempModel.findByIdAndUpdate(
      req.forgotPasswordAdmin!._id,
      {
        $set: {
          isExpired: true,
        },
      }
    );
    const response = new Custom_response(
      true,
      null,
      { token: changePasswordJwt },
      'success',
      200,
      null
    );
    res.status(response.statusCode).json(response);
  }
);
export { verifyForgotPasswordOtp };
