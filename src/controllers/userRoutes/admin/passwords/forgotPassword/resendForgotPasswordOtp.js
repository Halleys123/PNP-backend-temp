"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendForgotPasswordOtp = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const sendOtpViaEmail_1 = require("./helpers/sendOtpViaEmail");
const adminPerma_1 = require("../../../../../models/admin/schema/adminPerma");
const adminForgotPasswordTemp_1 = require("../../../../../models/admin/schema/adminForgotPasswordTemp");
const sendOtpViaPhone_1 = require("./helpers/sendOtpViaPhone");
const resendForgotPasswordOtp = (0, utils_1.async_error_handler)(async (req, res, next) => {
    const admin = await adminPerma_1.AdminModelPerma.findById(req.forgotPasswordAdmin.adminId);
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
        otp = await (0, sendOtpViaEmail_1.sendOtpViaEmail)(admin.name, admin.email, admin.phoneNumber);
    }
    else {
        otp = await (0, sendOtpViaPhone_1.sendOtpViaPhone)(admin.name, admin.email, admin.phoneNumber);
    }
    const jwt = await (0, utils_1.createJwt)({
        payload: { _id: req.forgotPasswordAdmin._id },
        options: { expiresIn: process.env.MAX_PASSWORD_CHANGE_TIME },
    }, process.env.FORGOT_PASSWORD_OTP_SECRET);
    await adminForgotPasswordTemp_1.AdminForgotPasswordTempModel.findByIdAndUpdate(req.forgotPasswordAdmin._id, {
        $set: {
            otp: otp,
            otpJwt: jwt,
            expiresAt: (0, adminForgotPasswordTemp_1.calculateExpiry)(),
            createdAt: Date.now(),
            otpSentTimes: req.forgotPasswordAdmin?.otpSentTimes + 1,
        },
    });
    const response = new utils_1.Custom_response(true, null, { token: jwt }, 'success', 200, null);
    res.status(response.statusCode).json(response);
});
exports.resendForgotPasswordOtp = resendForgotPasswordOtp;
