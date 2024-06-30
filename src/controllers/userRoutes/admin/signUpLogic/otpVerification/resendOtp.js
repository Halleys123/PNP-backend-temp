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
exports.resendOtp = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const types_1 = require("../../../../../types/types");
const adminTemp_1 = require("../../../../../models/admin/schema/adminTemp");
const sendOtpViaPhone_1 = require("../helpers/sendOtpViaPhone");
const resendOtp = (0, utils_1.async_error_handler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { name, email, phoneNumber } = req.admin;
    if (((_a = req.admin) === null || _a === void 0 ? void 0 : _a.otpSentTimes) >= 3)
        throw new utils_1.Custom_error({
            errors: [{ message: 'tryAfterSomeTime' }],
            statusCode: 400,
        });
    const phoneOtp = yield (0, sendOtpViaPhone_1.sendOtpViaPhone)(name, email, phoneNumber);
    const jwtForOtp = yield (0, utils_1.createJwt)({
        payload: { _id: req.admin._id, role: types_1.roles.BUYER },
        options: { expiresIn: process.env.SIGNUP_OTP_TIME },
    }, process.env.JWT_SIGNUP_OTP_SECRET);
    yield adminTemp_1.AdminModelTemp.updateOne({ phoneNumber }, {
        $set: {
            otp: phoneOtp,
            createdAt: Date.now(),
            expiresAt: (0, adminTemp_1.calculateExpiry)(),
            otpSentTimes: req.admin.otpSentTimes + 1,
            otpJwt: jwtForOtp,
        },
    });
    const response = new utils_1.Custom_response(true, null, { token: jwtForOtp }, 'success', 201, null);
    res.status(response.statusCode).json(response);
}));
exports.resendOtp = resendOtp;
