import {
  Custom_error,
  Custom_response,
  async_error_handler,
  createJwt,
} from '@himanshu_guptaorg/utils';
import { requestWithForgotPasswordSeller } from '../../../../../types/types';
import { sendOtpViaEmail } from './helpers/sendOtpViaEmail';
import { SellerModelPerma } from '../../../../../models/seller/schema/sellerPerma';
import {
  SellerForgotPasswordTempModel,
  calculateExpiry,
} from '../../../../../models/seller/schema/sellerForgotPasswordTemp';
import { sendOtpViaPhone } from './helpers/sendOtpViaPhone';

const resendForgotPasswordOtp = async_error_handler(
  async (req: requestWithForgotPasswordSeller, res, next) => {
    const seller = await SellerModelPerma.findById(
      req.forgotPasswordSeller!.sellerId
    );
    if (!seller)
      throw new Custom_error({
        errors: [{ message: 'noSuchUser' }],
        statusCode: 404,
      });
    if (req.forgotPasswordSeller!.isExpired)
      throw new Custom_error({
        errors: [{ message: 'otpExpired' }],
        statusCode: 401,
      });
    if (req.forgotPasswordSeller!.otpSentTimes == 3) {
      throw new Custom_error({
        errors: [{ message: 'tryAfterSomeTime' }],
        statusCode: 400,
      });
    }
    let otp: string;
    if (req.forgotPasswordSeller!.isEmail) {
      otp = await sendOtpViaEmail(
        seller.name,
        seller.email,
        seller.phoneNumber
      );
    } else {
      otp = await sendOtpViaPhone(
        seller.name,
        seller.email,
        seller.phoneNumber
      );
    }
    const jwt = await createJwt(
      {
        payload: { _id: req.forgotPasswordSeller!._id },
        options: { expiresIn: process.env.MAX_PASSWORD_CHANGE_TIME! },
      },
      process.env.FORGOT_PASSWORD_OTP_SECRET!
    );
    await SellerForgotPasswordTempModel.findByIdAndUpdate(
      req.forgotPasswordSeller!._id,
      {
        $set: {
          otp: otp,
          otpJwt: jwt,
          expiresAt: calculateExpiry(),
          createdAt: Date.now(),
          otpSentTimes: req.forgotPasswordSeller?.otpSentTimes! + 1,
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
