"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminSignUp = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const types_1 = require("../../../../../types/types");
const sendOtpViaPhone_1 = require("../helpers/sendOtpViaPhone");
const adminTemp_1 = require("../../../../../models/admin/schema/adminTemp");
const adminSignUp = (0, utils_1.async_error_handler)(async (req, res, next) => {
    const { name, email, phoneNumber, password, designation } = req.body;
    const hashedPassword = await (0, utils_1.hashPassword)(password);
    const phoneOtp = await (0, sendOtpViaPhone_1.sendOtpViaPhone)(name, email, phoneNumber);
    const user = adminTemp_1.AdminModelTemp.build({
        name,
        email,
        phoneNumber,
        password: hashedPassword,
        designation: designation,
        otp: phoneOtp,
        deviceFingerprint: req.device.hashedDeviceFingerprint,
    });
    const jwtForOtp = await (0, utils_1.createJwt)({
        payload: { _id: user._id, role: types_1.roles.SELLER },
        options: { expiresIn: process.env.SIGNUP_OTP_TIME },
    }, process.env.JWT_SIGNUP_OTP_SECRET);
    await user.save();
    await adminTemp_1.AdminModelTemp.updateOne({ phoneNumber }, { otpJwt: jwtForOtp });
    const response = new utils_1.Custom_response(true, null, { token: jwtForOtp, user }, 'success', 201, null);
    res.status(response.statusCode).json(response);
});
exports.adminSignUp = adminSignUp;
