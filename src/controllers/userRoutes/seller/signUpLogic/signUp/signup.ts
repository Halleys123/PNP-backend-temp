import {
  Custom_response,
  async_error_handler,
  createJwt,
  hashPassword,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { SellerModelTemp } from '../../../../../models/seller/schema/sellerTemp';
import {
  requestWithDeviceFingerprint,
  roles,
} from '../../../../../types/types';
import { sendOtpViaPhone } from '../helpers/sendOtpViaPhone';
import { sendOtpViaEmail } from '../helpers/sendOtpViaEmail';
const sellerSignUp: sync_middleware_type = async_error_handler(
  async (req: requestWithDeviceFingerprint, res, next) => {
    const {
      name,
      email,
      phoneNumber,
      address,
      password,
      accountInfo,
      bankAccount,
    } = req.body;
    const hashedPassword = await hashPassword(password);
    const phoneOtp = await sendOtpViaPhone(name, email, phoneNumber, address);
    const emailOtp = await sendOtpViaEmail(name, email, phoneNumber, address);
    const user = SellerModelTemp.build({
      name,
      email,
      phoneNumber,
      password: hashedPassword,
      address,
      phoneOtp: { otp: phoneOtp, otpSentTimes: 1 },
      emailOtp: { otp: emailOtp, otpSentTimes: 1 },
      deviceFingerprint: req.device!.hashedDeviceFingerprint!,
      otpJwt: 'jwt',
      accountInfo,
      bankAccount,
    });
    const jwtForOtp = await createJwt(
      {
        payload: { _id: user!._id, role: roles.SELLER },
        options: { expiresIn: process.env.SIGNUP_OTP_TIME },
      },
      process.env.JWT_SIGNUP_OTP_SECRET!
    );
    await user.save();
    await SellerModelTemp.updateOne({ phoneNumber }, { otpJwt: jwtForOtp });
    const response = new Custom_response(
      true,
      null,
      { token: jwtForOtp, user },
      'success',
      201,
      null
    );
    res.status(response.statusCode).json(response);
  }
);
export { sellerSignUp };
