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
exports.sendOtpViaEmail = void 0;
const generateOtp_1 = require("../../../../../utils/otp/generateOtp");
const sendOtpViaEmail = (name, email, phoneNumber) => __awaiter(void 0, void 0, void 0, function* () {
    const emailOtp = yield (0, generateOtp_1.getOtp)(6);
    // sendMailViaThread({
    //   text: `Hi ${name}! Your otp for Plants and Pots Paradise is ${emailOtp.generatedOtp}`,
    //   subject: 'Plants and Pots Paradise SignUp',
    //   from_info: 'Himanshu Gupta',
    //   toSendMail: email,
    //   cc: null,
    //   html: `<h1>Hi ${name}! your otp for Plants and Pots Paradise is ${emailOtp.generatedOtp}</h1>`,
    //   attachment: null,
    // });
    return emailOtp.hashedOtp;
});
exports.sendOtpViaEmail = sendOtpViaEmail;
