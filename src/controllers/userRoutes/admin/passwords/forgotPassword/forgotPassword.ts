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
  requestWithPermaAdmin,
} from '../../../../../types/types';
import {
  AdminPermaDoc,
  AdminModelPerma,
} from '../../../../../models/admin/schema/adminPerma';
import {
  AdminForgotPasswordTempDoc,
  AdminForgotPasswordTempModel,
} from '../../../../../models/admin/schema/adminForgotPasswordTemp';
import { sendOtpViaPhone } from './helpers/sendOtpViaPhone';
import mongoose from 'mongoose';
import { AdminForgotPasswordAttributesTemp } from '../../../../../models/admin/utils/common';
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
    let admin: AdminPermaDoc | null;
    let isEmail = false;
    let otp: string;
    if (isPhoneNumber(emailOrPhone)) {
      admin = await AdminModelPerma.findOne({
        phoneNumber: emailOrPhone,
      });
      isEmail = false;
      if (!admin)
        throw new Custom_error({
          errors: [{ message: 'noUserWithThisPhone' }],
          statusCode: 404,
        });
    } else {
      admin = await AdminModelPerma.findOne({
        email: emailOrPhone,
      });
      isEmail = true;
      if (!admin)
        throw new Custom_error({
          errors: [{ message: 'noUserWithThisEmail' }],
          statusCode: 404,
        });
    }

    const forgotPasswordInitiatedFirstAdmin =
      await AdminForgotPasswordTempModel.findOne({ adminId: admin._id });
    if (forgotPasswordInitiatedFirstAdmin) {
      if (
        new Date(forgotPasswordInitiatedFirstAdmin.expiresAt) >
        new Date(Date.now())
      )
        throw new Custom_error({
          errors: [{ message: 'forgotPasswordAlreadyInitiated' }],
          statusCode: 400,
        });
      else
        await AdminForgotPasswordTempModel.findByIdAndDelete(
          forgotPasswordInitiatedFirstAdmin._id
        );
    }
    if (isEmail) {
      console.log('Otp Being sent Via email');
      otp = await sendOtpViaEmail(admin.name, admin.email, admin.phoneNumber);
    } else {
      console.log('Otp Being sent Via phone');
      otp = await sendOtpViaPhone(admin.name, admin.email, admin.phoneNumber);
    }
    const forgotPasswordAdmin = AdminForgotPasswordTempModel.build({
      isEmail: isEmail,
      sendTo: emailOrPhone,
      adminId: admin._id as mongoose.Types.ObjectId,
      otp: otp,
      deviceFingerprint: await hashPassword(req.device?.deviceFingerprint!),
    });
    await forgotPasswordAdmin.save();
    const jwt = await createJwt(
      {
        payload: { _id: forgotPasswordAdmin._id },
        options: { expiresIn: process.env.MAX_PASSWORD_CHANGE_TIME! },
      },
      process.env.FORGOT_PASSWORD_OTP_SECRET!
    );
    await AdminForgotPasswordTempModel.findByIdAndUpdate(
      forgotPasswordAdmin._id,
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
