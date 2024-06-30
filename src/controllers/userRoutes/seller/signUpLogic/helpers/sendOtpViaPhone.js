"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOtpViaPhone = void 0;
const generateOtp_1 = require("../../../../../utils/otp/generateOtp");
const sendOtpViaPhone = (name, email, phoneNumber, address) => __awaiter(void 0, void 0, void 0, function* () {
    const phoneOtp = yield (0, generateOtp_1.getOtp)(6);
    // TODO: Implement logic for sms
    console.log(phoneOtp);
    console.warn('SENDING OTP VIA SMS');
    return phoneOtp.hashedOtp;
});
exports.sendOtpViaPhone = sendOtpViaPhone;
