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
exports.resendEmailOtp = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const types_1 = require("../../../../../types/types");
const sendOtpViaEmail_1 = require("../helpers/sendOtpViaEmail");
const buyerTemp_1 = require("../../../../../models/buyer/schema/buyerTemp");
const resendEmailOtp = (0, utils_1.async_error_handler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { name, email, phoneNumber, password } = req.buyer;
    if (((_a = req.buyer) === null || _a === void 0 ? void 0 : _a.emailOtp.otpSentTimes) >= 3)
        throw new utils_1.Custom_error({
            errors: [{ message: 'tryAfterSomeTime' }],
            statusCode: 400,
        });
    const emailOtp = yield (0, sendOtpViaEmail_1.sendOtpViaEmail)(name, email, phoneNumber);
    const jwtForOtp = yield (0, utils_1.createJwt)({
        payload: { _id: req.buyer._id, role: types_1.roles.BUYER },
        options: { expiresIn: process.env.SIGNUP_OTP_TIME },
    }, process.env.JWT_SIGNUP_OTP_SECRET);
    yield buyerTemp_1.BuyerModelTemp.updateOne({ email }, {
        $set: {
            'emailOtp.otp': emailOtp,
            'emailOtp.createdAt': Date.now(),
            'emailOtp.expiresAt': (0, buyerTemp_1.calculateExpiry)(),
            'emailOtp.otpSentTimes': req.buyer.emailOtp.otpSentTimes + 1,
            otpJwt: jwtForOtp,
        },
    });
    const response = new utils_1.Custom_response(true, null, { token: jwtForOtp }, 'success', 201, null);
    res.status(response.statusCode).json(response);
}));
exports.resendEmailOtp = resendEmailOtp;
