import { getOtp } from '../../../../../utils/otp/generateOtp';

export const sendOtpViaPhone = async (
  name: string,
  email: string,
  phoneNumber: string
) => {
  const phoneOtp = await getOtp(6);
  // TODO: Implement logic for sms
  console.log(phoneOtp);
  console.warn('SENDING OTP VIA SMS');
  return phoneOtp.hashedOtp;
};
