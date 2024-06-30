"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOtpViaPhone = void 0;
const generateOtp_1 = require("../../../../../utils/otp/generateOtp");
const sendOtpViaPhone = async (name, email, phoneNumber) => {
    const phoneOtp = await (0, generateOtp_1.getOtp)(6);
    // TODO: Implement logic for sms
    console.log(phoneOtp);
    console.warn('SENDING OTP VIA SMS');
    return phoneOtp.hashedOtp;
};
exports.sendOtpViaPhone = sendOtpViaPhone;
