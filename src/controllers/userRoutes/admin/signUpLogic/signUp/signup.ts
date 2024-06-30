import {
  Custom_response,
  async_error_handler,
  createJwt,
  hashPassword,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import {
  requestWithDeviceFingerprint,
  roles,
} from '../../../../../types/types';
import { sendOtpViaPhone } from '../helpers/sendOtpViaPhone';
import { sendOtpViaEmail } from '../helpers/sendOtpViaEmail';
import { AdminModelTemp } from '../../../../../models/admin/schema/adminTemp';
const adminSignUp: sync_middleware_type = async_error_handler(
  async (req: requestWithDeviceFingerprint, res, next) => {
    const { name, email, phoneNumber, password, designation } = req.body;
    const hashedPassword = await hashPassword(password);
    const phoneOtp = await sendOtpViaPhone(name, email, phoneNumber);

    const user = AdminModelTemp.build({
      name,
      email,
      phoneNumber,
      password: hashedPassword,
      designation: designation,
      otp: phoneOtp,
      deviceFingerprint: req.device!.hashedDeviceFingerprint!,
    });
    const jwtForOtp = await createJwt(
      {
        payload: { _id: user!._id, role: roles.SELLER },
        options: { expiresIn: process.env.SIGNUP_OTP_TIME },
      },
      process.env.JWT_SIGNUP_OTP_SECRET!
    );
    await user.save();
    await AdminModelTemp.updateOne({ phoneNumber }, { otpJwt: jwtForOtp });
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
export { adminSignUp };
