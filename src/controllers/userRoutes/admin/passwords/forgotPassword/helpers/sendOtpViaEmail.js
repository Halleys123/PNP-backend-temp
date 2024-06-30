"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOtpViaEmail = void 0;
const sendMailViaThread_1 = require("../../../../../../utils/mail/sendMailViaThread");
const generateOtp_1 = require("../../../../../../utils/otp/generateOtp");
const sendOtpViaEmail = async (name, email, phoneNumber) => {
    const emailOtp = await (0, generateOtp_1.getOtp)(6);
    console.log(emailOtp);
    (0, sendMailViaThread_1.sendMailViaThread)({
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
exports.sendOtpViaEmail = sendOtpViaEmail;
