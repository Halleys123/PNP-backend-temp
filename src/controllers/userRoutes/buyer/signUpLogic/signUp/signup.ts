import {
  Custom_response,
  async_error_handler,
  createJwt,
  hashPassword,
  sync_middleware_type,
} from "@himanshu_guptaorg/utils";
import { BuyerModelTemp } from "../../../../../models/buyer/schema/buyerTemp";
import {
  requestWithDeviceFingerprint,
  roles,
} from "../../../../../types/types";
import { sendOtpViaPhone } from "../helpers/sendOtpViaPhone";
import { sendOtpViaEmail } from "../helpers/sendOtpViaEmail";
const buyerSignUp: sync_middleware_type = async_error_handler(
  async (req: requestWithDeviceFingerprint, res, next) => {
    const { name, email, phoneNumber, address, password } = req.body;
    const hashedPassword = await hashPassword(password);
    const phoneOtp = await sendOtpViaPhone(name, email, phoneNumber);
    const emailOtp = await sendOtpViaEmail(name, email, phoneNumber);
    const user = BuyerModelTemp.build({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      phoneOtp: { otp: phoneOtp, otpSentTimes: 1 },
      emailOtp: { otp: emailOtp, otpSentTimes: 1 },
      deviceFingerprint: req.device!.hashedDeviceFingerprint!,
      otpJwt: "jwt",
    });
    const jwtForOtp = await createJwt(
      {
        payload: { _id: user!._id, role: roles.BUYER },
        options: { expiresIn: process.env.SIGNUP_OTP_TIME },
      },
      process.env.JWT_SIGNUP_OTP_SECRET!
    );
    await user.save();
    await BuyerModelTemp.updateOne({ phoneNumber }, { otpJwt: jwtForOtp });
    const response = new Custom_response(
      true,
      null,
      { token: jwtForOtp, user },
      "success",
      201,
      null
    );
    res.status(response.statusCode).json(response);
  }
);
export { buyerSignUp };
