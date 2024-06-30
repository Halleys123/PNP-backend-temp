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
exports.sellerSignUp = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const sellerTemp_1 = require("../../../../../models/seller/schema/sellerTemp");
const types_1 = require("../../../../../types/types");
const sendOtpViaPhone_1 = require("../helpers/sendOtpViaPhone");
const sendOtpViaEmail_1 = require("../helpers/sendOtpViaEmail");
const sellerSignUp = (0, utils_1.async_error_handler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, phoneNumber, address, password, accountInfo, bankAccount, } = req.body;
    const hashedPassword = yield (0, utils_1.hashPassword)(password);
    const phoneOtp = yield (0, sendOtpViaPhone_1.sendOtpViaPhone)(name, email, phoneNumber, address);
    const emailOtp = yield (0, sendOtpViaEmail_1.sendOtpViaEmail)(name, email, phoneNumber, address);
    const user = sellerTemp_1.SellerModelTemp.build({
        name,
        email,
        phoneNumber,
        password: hashedPassword,
        address,
        phoneOtp: { otp: phoneOtp, otpSentTimes: 1 },
        emailOtp: { otp: emailOtp, otpSentTimes: 1 },
        deviceFingerprint: req.device.hashedDeviceFingerprint,
        otpJwt: 'jwt',
        accountInfo,
        bankAccount,
    });
    const jwtForOtp = yield (0, utils_1.createJwt)({
        payload: { _id: user._id, role: types_1.roles.SELLER },
        options: { expiresIn: process.env.SIGNUP_OTP_TIME },
    }, process.env.JWT_SIGNUP_OTP_SECRET);
    yield user.save();
    yield sellerTemp_1.SellerModelTemp.updateOne({ phoneNumber }, { otpJwt: jwtForOtp });
    const response = new utils_1.Custom_response(true, null, { token: jwtForOtp, user }, 'success', 201, null);
    res.status(response.statusCode).json(response);
}));
exports.sellerSignUp = sellerSignUp;
