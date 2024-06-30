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
const sellerTemp_1 = require("../../../../../models/seller/schema/sellerTemp");
const resendEmailOtp = (0, utils_1.async_error_handler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { name, email, phoneNumber, address, password } = req.seller;
    if (((_a = req.seller) === null || _a === void 0 ? void 0 : _a.emailOtp.otpSentTimes) >= 3)
        throw new utils_1.Custom_error({
            errors: [{ message: 'tryAfterSomeTime' }],
            statusCode: 400,
        });
    const emailOtp = yield (0, sendOtpViaEmail_1.sendOtpViaEmail)(name, email, phoneNumber, address);
    const jwtForOtp = yield (0, utils_1.createJwt)({
        payload: { _id: req.seller._id, role: types_1.roles.SELLER },
        options: { expiresIn: process.env.SIGNUP_OTP_TIME },
    }, process.env.JWT_SIGNUP_OTP_SECRET);
    yield sellerTemp_1.SellerModelTemp.updateOne({ email }, {
        $set: {
            'emailOtp.otp': emailOtp,
            'emailOtp.createdAt': Date.now(),
            'emailOtp.expiresAt': (0, sellerTemp_1.calculateExpiry)(),
            'emailOtp.otpSentTimes': req.seller.emailOtp.otpSentTimes + 1,
            otpJwt: jwtForOtp,
        },
    });
    const response = new utils_1.Custom_response(true, null, { token: jwtForOtp }, 'success', 201, null);
    res.status(response.statusCode).json(response);
}));
exports.resendEmailOtp = resendEmailOtp;
