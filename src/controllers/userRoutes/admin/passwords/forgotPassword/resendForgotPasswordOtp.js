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
exports.resendForgotPasswordOtp = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const sendOtpViaEmail_1 = require("./helpers/sendOtpViaEmail");
const adminPerma_1 = require("../../../../../models/admin/schema/adminPerma");
const adminForgotPasswordTemp_1 = require("../../../../../models/admin/schema/adminForgotPasswordTemp");
const sendOtpViaPhone_1 = require("./helpers/sendOtpViaPhone");
const resendForgotPasswordOtp = (0, utils_1.async_error_handler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const admin = yield adminPerma_1.AdminModelPerma.findById(req.forgotPasswordAdmin.adminId);
    if (!admin)
        throw new utils_1.Custom_error({
            errors: [{ message: 'noSuchUser' }],
            statusCode: 404,
        });
    if (req.forgotPasswordAdmin.isExpired)
        throw new utils_1.Custom_error({
            errors: [{ message: 'otpExpired' }],
            statusCode: 401,
        });
    if (req.forgotPasswordAdmin.otpSentTimes == 3) {
        throw new utils_1.Custom_error({
            errors: [{ message: 'tryAfterSomeTime' }],
            statusCode: 400,
        });
    }
    let otp;
    console.log('himanshu');
    if (req.forgotPasswordAdmin.isEmail) {
        otp = yield (0, sendOtpViaEmail_1.sendOtpViaEmail)(admin.name, admin.email, admin.phoneNumber);
    }
    else {
        otp = yield (0, sendOtpViaPhone_1.sendOtpViaPhone)(admin.name, admin.email, admin.phoneNumber);
    }
    const jwt = yield (0, utils_1.createJwt)({
        payload: { _id: req.forgotPasswordAdmin._id },
        options: { expiresIn: process.env.MAX_PASSWORD_CHANGE_TIME },
    }, process.env.FORGOT_PASSWORD_OTP_SECRET);
    yield adminForgotPasswordTemp_1.AdminForgotPasswordTempModel.findByIdAndUpdate(req.forgotPasswordAdmin._id, {
        $set: {
            otp: otp,
            otpJwt: jwt,
            expiresAt: (0, adminForgotPasswordTemp_1.calculateExpiry)(),
            createdAt: Date.now(),
            otpSentTimes: ((_a = req.forgotPasswordAdmin) === null || _a === void 0 ? void 0 : _a.otpSentTimes) + 1,
        },
    });
    const response = new utils_1.Custom_response(true, null, { token: jwt }, 'success', 200, null);
    res.status(response.statusCode).json(response);
}));
exports.resendForgotPasswordOtp = resendForgotPasswordOtp;
