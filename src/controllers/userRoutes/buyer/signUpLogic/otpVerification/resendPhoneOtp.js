"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendPhoneOtp = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const types_1 = require("../../../../../types/types");
const buyerTemp_1 = require("../../../../../models/buyer/schema/buyerTemp");
const sendOtpViaPhone_1 = require("../helpers/sendOtpViaPhone");
const resendPhoneOtp = (0, utils_1.async_error_handler)(async (req, res, next) => {
    const { name, email, phoneNumber, password } = req.buyer;
    if (req.buyer?.phoneOtp.otpSentTimes >= 3)
        throw new utils_1.Custom_error({
            errors: [{ message: 'tryAfterSomeTime' }],
            statusCode: 400,
        });
    const phoneOtp = await (0, sendOtpViaPhone_1.sendOtpViaPhone)(name, email, phoneNumber);
    const jwtForOtp = await (0, utils_1.createJwt)({
        payload: { _id: req.buyer._id, role: types_1.roles.BUYER },
        options: { expiresIn: process.env.SIGNUP_OTP_TIME },
    }, process.env.JWT_SIGNUP_OTP_SECRET);
    await buyerTemp_1.BuyerModelTemp.updateOne({ phoneNumber }, {
        $set: {
            'phoneOtp.otp': phoneOtp,
            'phoneOtp.createdAt': Date.now(),
            'phoneOtp.expiresAt': (0, buyerTemp_1.calculateExpiry)(),
            'phoneOtp.otpSentTimes': req.buyer.phoneOtp.otpSentTimes + 1,
            otpJwt: jwtForOtp,
        },
    });
    const response = new utils_1.Custom_response(true, null, { token: jwtForOtp }, 'success', 201, null);
    res.status(response.statusCode).json(response);
});
exports.resendPhoneOtp = resendPhoneOtp;
