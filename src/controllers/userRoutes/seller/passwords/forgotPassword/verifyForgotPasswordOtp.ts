import {
  Custom_error,
  Custom_response,
  async_error_handler,
  createJwt,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { requestWithForgotPasswordSeller } from '../../../../../types/types';
import { checkOtp } from '../../../../../utils/otp/generateOtp';
import { SellerForgotPasswordTempModel } from '../../../../../models/seller/schema/sellerForgotPasswordTemp';

const verifyForgotPasswordOtp: sync_middleware_type = async_error_handler(
  async (req: requestWithForgotPasswordSeller, res, next) => {
    const { otp } = req.body;
    if (!otp)
      throw new Custom_error({
        errors: [{ message: 'noOtpSent' }],
        statusCode: 400,
      });

    if (req.forgotPasswordSeller!.isExpired)
      throw new Custom_error({
        errors: [{ message: 'otpExpired' }],
        statusCode: 401,
      });
    if (!(await checkOtp(otp, req.forgotPasswordSeller!.otp!))) {
      throw new Custom_error({
        errors: [{ message: 'otpMismatch' }],
        statusCode: 200,
      });
    }
    const changePasswordJwt = await createJwt(
      {
        payload: { _id: req.forgotPasswordSeller!._id },
        options: { expiresIn: process.env.MAX_PASSWORD_CHANGE_TIME },
      },
      process.env.CHANGE_PASSWORD_SECRET!
    );
    await SellerForgotPasswordTempModel.findByIdAndUpdate(
      req.forgotPasswordSeller!._id,
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
