"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyForgotPasswordOtp = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const generateOtp_1 = require("../../../../../utils/otp/generateOtp");
const adminForgotPasswordTemp_1 = require("../../../../../models/admin/schema/adminForgotPasswordTemp");
const verifyForgotPasswordOtp = (0, utils_1.async_error_handler)(async (req, res, next) => {
    const { otp } = req.body;
    if (!otp)
        throw new utils_1.Custom_error({
            errors: [{ message: 'noOtpSent' }],
            statusCode: 400,
        });
    if (req.forgotPasswordAdmin.isExpired)
        throw new utils_1.Custom_error({
            errors: [{ message: 'otpExpired' }],
            statusCode: 401,
        });
    if (!(await (0, generateOtp_1.checkOtp)(otp, req.forgotPasswordAdmin.otp))) {
        throw new utils_1.Custom_error({
            errors: [{ message: 'otpMismatch' }],
            statusCode: 400,
        });
    }
    const changePasswordJwt = await (0, utils_1.createJwt)({
        payload: { _id: req.forgotPasswordAdmin._id },
        options: { expiresIn: process.env.MAX_PASSWORD_CHANGE_TIME },
    }, process.env.CHANGE_PASSWORD_SECRET);
    await adminForgotPasswordTemp_1.AdminForgotPasswordTempModel.findByIdAndUpdate(req.forgotPasswordAdmin._id, {
        $set: {
            isExpired: true,
        },
    });
    const response = new utils_1.Custom_response(true, null, { token: changePasswordJwt }, 'success', 200, null);
    res.status(response.statusCode).json(response);
});
exports.verifyForgotPasswordOtp = verifyForgotPasswordOtp;
