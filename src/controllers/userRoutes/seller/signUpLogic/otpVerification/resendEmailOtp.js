"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendEmailOtp = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const types_1 = require("../../../../../types/types");
const sendOtpViaEmail_1 = require("../helpers/sendOtpViaEmail");
const sellerTemp_1 = require("../../../../../models/seller/schema/sellerTemp");
const resendEmailOtp = (0, utils_1.async_error_handler)(async (req, res, next) => {
    const { name, email, phoneNumber, address, password } = req.seller;
    if (req.seller?.emailOtp.otpSentTimes >= 3)
        throw new utils_1.Custom_error({
            errors: [{ message: 'tryAfterSomeTime' }],
            statusCode: 400,
        });
    const emailOtp = await (0, sendOtpViaEmail_1.sendOtpViaEmail)(name, email, phoneNumber, address);
    const jwtForOtp = await (0, utils_1.createJwt)({
        payload: { _id: req.seller._id, role: types_1.roles.SELLER },
        options: { expiresIn: process.env.SIGNUP_OTP_TIME },
    }, process.env.JWT_SIGNUP_OTP_SECRET);
    await sellerTemp_1.SellerModelTemp.updateOne({ email }, {
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
});
exports.resendEmailOtp = resendEmailOtp;
