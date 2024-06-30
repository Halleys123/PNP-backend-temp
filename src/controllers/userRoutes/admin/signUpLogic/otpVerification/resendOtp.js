"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendOtp = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const types_1 = require("../../../../../types/types");
const adminTemp_1 = require("../../../../../models/admin/schema/adminTemp");
const sendOtpViaPhone_1 = require("../helpers/sendOtpViaPhone");
const resendOtp = (0, utils_1.async_error_handler)(async (req, res, next) => {
    const { name, email, phoneNumber } = req.admin;
    if (req.admin?.otpSentTimes >= 3)
        throw new utils_1.Custom_error({
            errors: [{ message: 'tryAfterSomeTime' }],
            statusCode: 400,
        });
    const phoneOtp = await (0, sendOtpViaPhone_1.sendOtpViaPhone)(name, email, phoneNumber);
    const jwtForOtp = await (0, utils_1.createJwt)({
        payload: { _id: req.admin._id, role: types_1.roles.BUYER },
        options: { expiresIn: process.env.SIGNUP_OTP_TIME },
    }, process.env.JWT_SIGNUP_OTP_SECRET);
    await adminTemp_1.AdminModelTemp.updateOne({ phoneNumber }, {
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
});
exports.resendOtp = resendOtp;
