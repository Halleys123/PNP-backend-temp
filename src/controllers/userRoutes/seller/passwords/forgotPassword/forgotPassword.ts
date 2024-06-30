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
  requestWithPermaSeller,
} from '../../../../../types/types';
import {
  SellerDocPerma,
  SellerModelPerma,
} from '../../../../../models/seller/schema/sellerPerma';
import {
  SellerForgotPasswordTempDoc,
  SellerForgotPasswordTempModel,
} from '../../../../../models/seller/schema/sellerForgotPasswordTemp';
import { sendOtpViaPhone } from './helpers/sendOtpViaPhone';
import mongoose from 'mongoose';
import { SellerForgotPasswordAttributesTemp } from '../../../../../models/seller/utils/common';
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
    let seller: SellerDocPerma | null;
    let isEmail = false;
    let otp: string;
    if (isPhoneNumber(emailOrPhone)) {
      seller = await SellerModelPerma.findOne({
        phoneNumber: emailOrPhone,
      });
      isEmail = false;
      if (!seller)
        throw new Custom_error({
          errors: [{ message: 'noUserWithThisPhone' }],
          statusCode: 404,
        });
    } else {
      seller = await SellerModelPerma.findOne({
        email: emailOrPhone,
      });
      isEmail = true;
      if (!seller)
        throw new Custom_error({
          errors: [{ message: 'noUserWithThisEmail' }],
          statusCode: 404,
        });
    }

    const forgotPasswordInitiatedFirstSeller =
      await SellerForgotPasswordTempModel.findOne({ sellerId: seller._id });
    if (forgotPasswordInitiatedFirstSeller) {
      if (
        new Date(forgotPasswordInitiatedFirstSeller.expiresAt) >
        new Date(Date.now())
      )
        throw new Custom_error({
          errors: [{ message: 'forgotPasswordAlreadyInitiated' }],
          statusCode: 400,
        });
      else
        await SellerForgotPasswordTempModel.findByIdAndDelete(
          forgotPasswordInitiatedFirstSeller._id
        );
    }
    if (isEmail) {
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
    const forgotPasswordSeller = SellerForgotPasswordTempModel.build({
      isEmail: isEmail,
      sendTo: emailOrPhone,
      sellerId: seller._id as mongoose.Types.ObjectId,
      otp: otp,
      deviceFingerprint: await hashPassword(req.device?.deviceFingerprint!),
    });
    await forgotPasswordSeller.save();
    const jwt = await createJwt(
      {
        payload: { _id: forgotPasswordSeller._id },
        options: { expiresIn: process.env.MAX_PASSWORD_CHANGE_TIME! },
      },
      process.env.FORGOT_PASSWORD_OTP_SECRET!
    );
    await SellerForgotPasswordTempModel.findByIdAndUpdate(
      forgotPasswordSeller._id,
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
