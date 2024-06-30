import { sendMail } from '../../../../../utils/mail/sendMail';
import { sendMailViaThread } from '../../../../../utils/mail/sendMailViaThread';
import { getOtp } from '../../../../../utils/otp/generateOtp';

export const sendOtpViaEmail = async (
  name: string,
  email: string,
  phoneNumber: string
) => {
  const emailOtp = await getOtp(6);
  sendMailViaThread({
    text: `Hi ${name}! Your otp for Plants and Pots Paradise is ${emailOtp.generatedOtp}`,
    subject: 'Plants and Pots Paradise SignUp',
    from_info: 'Himanshu Gupta',
    toSendMail: email,
    cc: null,
    html: `<h1>Hi ${name}! your otp for Plants and Pots Paradise is ${emailOtp.generatedOtp}</h1>`,
    attachment: null,
  });
  return emailOtp.hashedOtp;
};
