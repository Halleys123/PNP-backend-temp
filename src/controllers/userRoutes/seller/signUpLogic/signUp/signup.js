"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sellerSignUp = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const sellerTemp_1 = require("../../../../../models/seller/schema/sellerTemp");
const types_1 = require("../../../../../types/types");
const sendOtpViaPhone_1 = require("../helpers/sendOtpViaPhone");
const sendOtpViaEmail_1 = require("../helpers/sendOtpViaEmail");
const sellerSignUp = (0, utils_1.async_error_handler)(async (req, res, next) => {
    const { name, email, phoneNumber, address, password, accountInfo, bankAccount, } = req.body;
    const hashedPassword = await (0, utils_1.hashPassword)(password);
    const phoneOtp = await (0, sendOtpViaPhone_1.sendOtpViaPhone)(name, email, phoneNumber, address);
    const emailOtp = await (0, sendOtpViaEmail_1.sendOtpViaEmail)(name, email, phoneNumber, address);
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
    const jwtForOtp = await (0, utils_1.createJwt)({
        payload: { _id: user._id, role: types_1.roles.SELLER },
        options: { expiresIn: process.env.SIGNUP_OTP_TIME },
    }, process.env.JWT_SIGNUP_OTP_SECRET);
    await user.save();
    await sellerTemp_1.SellerModelTemp.updateOne({ phoneNumber }, { otpJwt: jwtForOtp });
    const response = new utils_1.Custom_response(true, null, { token: jwtForOtp, user }, 'success', 201, null);
    res.status(response.statusCode).json(response);
});
exports.sellerSignUp = sellerSignUp;
