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
exports.forgotPassword = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const adminPerma_1 = require("../../../../../models/admin/schema/adminPerma");
const adminForgotPasswordTemp_1 = require("../../../../../models/admin/schema/adminForgotPasswordTemp");
const sendOtpViaPhone_1 = require("./helpers/sendOtpViaPhone");
const sendOtpViaEmail_1 = require("./helpers/sendOtpViaEmail");
const isPhoneNumber = (input) => {
    const phoneRegex = /^[0-9]{10,15}$/;
    return phoneRegex.test(input);
};
const forgotPassword = (0, utils_1.async_error_handler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { emailOrPhone } = req.body;
    if (!emailOrPhone)
        throw new utils_1.Custom_error({
            errors: [{ message: 'sendEmailOrPhone' }],
            statusCode: 400,
        });
    let admin;
    let isEmail = false;
    let otp;
    if (isPhoneNumber(emailOrPhone)) {
        admin = yield adminPerma_1.AdminModelPerma.findOne({
            phoneNumber: emailOrPhone,
        });
        isEmail = false;
        if (!admin)
            throw new utils_1.Custom_error({
                errors: [{ message: 'noUserWithThisPhone' }],
                statusCode: 404,
            });
    }
    else {
        admin = yield adminPerma_1.AdminModelPerma.findOne({
            email: emailOrPhone,
        });
        isEmail = true;
        if (!admin)
            throw new utils_1.Custom_error({
                errors: [{ message: 'noUserWithThisEmail' }],
                statusCode: 404,
            });
    }
    const forgotPasswordInitiatedFirstAdmin = yield adminForgotPasswordTemp_1.AdminForgotPasswordTempModel.findOne({ adminId: admin._id });
    if (forgotPasswordInitiatedFirstAdmin) {
        if (new Date(forgotPasswordInitiatedFirstAdmin.expiresAt) >
            new Date(Date.now()))
            throw new utils_1.Custom_error({
                errors: [{ message: 'forgotPasswordAlreadyInitiated' }],
                statusCode: 400,
            });
        else
            yield adminForgotPasswordTemp_1.AdminForgotPasswordTempModel.findByIdAndDelete(forgotPasswordInitiatedFirstAdmin._id);
    }
    if (isEmail) {
        console.log('Otp Being sent Via email');
        otp = yield (0, sendOtpViaEmail_1.sendOtpViaEmail)(admin.name, admin.email, admin.phoneNumber);
    }
    else {
        console.log('Otp Being sent Via phone');
        otp = yield (0, sendOtpViaPhone_1.sendOtpViaPhone)(admin.name, admin.email, admin.phoneNumber);
    }
    const forgotPasswordAdmin = adminForgotPasswordTemp_1.AdminForgotPasswordTempModel.build({
        isEmail: isEmail,
        sendTo: emailOrPhone,
        adminId: admin._id,
        otp: otp,
        deviceFingerprint: yield (0, utils_1.hashPassword)((_a = req.device) === null || _a === void 0 ? void 0 : _a.deviceFingerprint),
    });
    yield forgotPasswordAdmin.save();
    const jwt = yield (0, utils_1.createJwt)({
        payload: { _id: forgotPasswordAdmin._id },
        options: { expiresIn: process.env.MAX_PASSWORD_CHANGE_TIME },
    }, process.env.FORGOT_PASSWORD_OTP_SECRET);
    yield adminForgotPasswordTemp_1.AdminForgotPasswordTempModel.findByIdAndUpdate(forgotPasswordAdmin._id, { $set: { otpJwt: jwt } });
    const response = new utils_1.Custom_response(true, null, { token: jwt }, 'success', 200, null);
    res.status(response.statusCode).json(response);
}));
exports.forgotPassword = forgotPassword;
