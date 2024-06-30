import {
  Custom_error,
  Custom_response,
  async_error_handler,
  createJwt,
  hashPassword,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import {
  requestWithDeviceFingerprint,
  requestWithPermaBuyer,
} from '../../../../../types/types';
import {
  BuyerDocPerma,
  BuyerModelPerma,
} from '../../../../../models/buyer/schema/buyerPerma';
import {
  BuyerForgotPasswordTempDoc,
  BuyerForgotPasswordTempModel,
} from '../../../../../models/buyer/schema/buyerForgotPasswordTemp';
import { sendOtpViaPhone } from './helpers/sendOtpViaPhone';
import mongoose from 'mongoose';
import { BuyerForgotPasswordAttributesTemp } from '../../../../../models/buyer/utils/common';
import { sendOtpViaEmail } from './helpers/sendOtpViaEmail';
const isPhoneNumber = (input: string): boolean => {
  const phoneRegex = /^[0-9]{10,15}$/;
  return phoneRegex.test(input);
};
const forgotPassword: sync_middleware_type = async_error_handler(
  async (req: requestWithDeviceFingerprint, res, next) => {
    const { emailOrPhone } = req.body;
    if (!emailOrPhone)
      throw new Custom_error({
        errors: [{ message: 'sendEmailOrPhone' }],
        statusCode: 400,
      });
    let buyer: BuyerDocPerma | null;
    let isEmail = false;
    let otp: string;
    if (isPhoneNumber(emailOrPhone)) {
      buyer = await BuyerModelPerma.findOne({
        phoneNumber: emailOrPhone,
      });
      isEmail = false;
      if (!buyer)
        throw new Custom_error({
          errors: [{ message: 'noUserWithThisPhone' }],
          statusCode: 404,
        });
    } else {
      buyer = await BuyerModelPerma.findOne({
        email: emailOrPhone,
      });
      isEmail = true;
      if (!buyer)
        throw new Custom_error({
          errors: [{ message: 'noUserWithThisEmail' }],
          statusCode: 404,
        });
    }

    const forgotPasswordInitiatedFirstBuyer =
      await BuyerForgotPasswordTempModel.findOne({ buyerId: buyer._id });
    if (forgotPasswordInitiatedFirstBuyer) {
      if (
        new Date(forgotPasswordInitiatedFirstBuyer.expiresAt) >
        new Date(Date.now())
      )
        throw new Custom_error({
          errors: [{ message: 'forgotPasswordAlreadyInitiated' }],
          statusCode: 400,
        });
      else
        await BuyerForgotPasswordTempModel.findByIdAndDelete(
          forgotPasswordInitiatedFirstBuyer._id
        );
    }
    if (isEmail) {
      console.log('Otp Being sent Via email');
      otp = await sendOtpViaEmail(buyer.name, buyer.email, buyer.phoneNumber);
    } else {
      console.log('Otp Being sent Via phone');
      otp = await sendOtpViaPhone(buyer.name, buyer.email, buyer.phoneNumber);
    }
    const forgotPasswordBuyer = BuyerForgotPasswordTempModel.build({
      isEmail: isEmail,
      sendTo: emailOrPhone,
      buyerId: buyer._id as mongoose.Types.ObjectId,
      otp: otp,
      deviceFingerprint: await hashPassword(req.device?.deviceFingerprint!),
    });
    await forgotPasswordBuyer.save();
    const jwt = await createJwt(
      {
        payload: { _id: forgotPasswordBuyer._id },
        options: { expiresIn: process.env.MAX_PASSWORD_CHANGE_TIME! },
      },
      process.env.FORGOT_PASSWORD_OTP_SECRET!
    );
    await BuyerForgotPasswordTempModel.findByIdAndUpdate(
      forgotPasswordBuyer._id,
      { $set: { otpJwt: jwt } }
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
export { forgotPassword };
