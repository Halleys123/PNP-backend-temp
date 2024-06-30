"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendForgotPasswordOtp = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const sendOtpViaEmail_1 = require("./helpers/sendOtpViaEmail");
const sellerPerma_1 = require("../../../../../models/seller/schema/sellerPerma");
const sellerForgotPasswordTemp_1 = require("../../../../../models/seller/schema/sellerForgotPasswordTemp");
const sendOtpViaPhone_1 = require("./helpers/sendOtpViaPhone");
const resendForgotPasswordOtp = (0, utils_1.async_error_handler)(async (req, res, next) => {
    const seller = await sellerPerma_1.SellerModelPerma.findById(req.forgotPasswordSeller.sellerId);
    if (!seller)
        throw new utils_1.Custom_error({
            errors: [{ message: 'noSuchUser' }],
            statusCode: 404,
        });
    if (req.forgotPasswordSeller.isExpired)
        throw new utils_1.Custom_error({
            errors: [{ message: 'otpExpired' }],
            statusCode: 401,
        });
    if (req.forgotPasswordSeller.otpSentTimes == 3) {
        throw new utils_1.Custom_error({
            errors: [{ message: 'tryAfterSomeTime' }],
            statusCode: 400,
        });
    }
    let otp;
    if (req.forgotPasswordSeller.isEmail) {
        otp = await (0, sendOtpViaEmail_1.sendOtpViaEmail)(seller.name, seller.email, seller.phoneNumber);
    }
    else {
        otp = await (0, sendOtpViaPhone_1.sendOtpViaPhone)(seller.name, seller.email, seller.phoneNumber);
    }
    const jwt = await (0, utils_1.createJwt)({
        payload: { _id: req.forgotPasswordSeller._id },
        options: { expiresIn: process.env.MAX_PASSWORD_CHANGE_TIME },
    }, process.env.FORGOT_PASSWORD_OTP_SECRET);
    await sellerForgotPasswordTemp_1.SellerForgotPasswordTempModel.findByIdAndUpdate(req.forgotPasswordSeller._id, {
        $set: {
            otp: otp,
            otpJwt: jwt,
            expiresAt: (0, sellerForgotPasswordTemp_1.calculateExpiry)(),
            createdAt: Date.now(),
            otpSentTimes: req.forgotPasswordSeller?.otpSentTimes + 1,
        },
    });
    const response = new utils_1.Custom_response(true, null, { token: jwt }, 'success', 200, null);
    res.status(response.statusCode).json(response);
});
exports.resendForgotPasswordOtp = resendForgotPasswordOtp;
