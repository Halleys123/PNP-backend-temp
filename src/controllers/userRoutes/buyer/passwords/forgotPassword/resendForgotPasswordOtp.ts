import {
  Custom_error,
  Custom_response,
  async_error_handler,
  createJwt,
} from '@himanshu_guptaorg/utils';
import { requestWithForgotPasswordBuyer } from '../../../../../types/types';
import { sendOtpViaEmail } from './helpers/sendOtpViaEmail';
import { BuyerModelPerma } from '../../../../../models/buyer/schema/buyerPerma';
import {
  BuyerForgotPasswordTempModel,
  calculateExpiry,
} from '../../../../../models/buyer/schema/buyerForgotPasswordTemp';
import { sendOtpViaPhone } from './helpers/sendOtpViaPhone';

const resendForgotPasswordOtp = async_error_handler(
  async (req: requestWithForgotPasswordBuyer, res, next) => {
    const buyer = await BuyerModelPerma.findById(
      req.forgotPasswordBuyer!.buyerId
    );
    if (!buyer)
      throw new Custom_error({
        errors: [{ message: 'noSuchUser' }],
        statusCode: 404,
      });
    if (req.forgotPasswordBuyer!.isExpired)
      throw new Custom_error({
        errors: [{ message: 'otpExpired' }],
        statusCode: 401,
      });
    if (req.forgotPasswordBuyer!.otpSentTimes == 3) {
      throw new Custom_error({
        errors: [{ message: 'tryAfterSomeTime' }],
        statusCode: 400,
      });
    }
    let otp: string;
    console.log('himanshu');
    if (req.forgotPasswordBuyer!.isEmail) {
      otp = await sendOtpViaEmail(buyer.name, buyer.email, buyer.phoneNumber);
    } else {
      otp = await sendOtpViaPhone(buyer.name, buyer.email, buyer.phoneNumber);
    }
    const jwt = await createJwt(
      {
        payload: { _id: req.forgotPasswordBuyer!._id },
        options: { expiresIn: process.env.MAX_PASSWORD_CHANGE_TIME! },
      },
      process.env.FORGOT_PASSWORD_OTP_SECRET!
    );
    await BuyerForgotPasswordTempModel.findByIdAndUpdate(
      req.forgotPasswordBuyer!._id,
      {
        $set: {
          otp: otp,
          otpJwt: jwt,
          expiresAt: calculateExpiry(),
          createdAt: Date.now(),
          otpSentTimes: req.forgotPasswordBuyer?.otpSentTimes! + 1,
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
