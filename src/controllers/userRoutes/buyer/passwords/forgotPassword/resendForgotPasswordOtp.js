"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendForgotPasswordOtp = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const sendOtpViaEmail_1 = require("./helpers/sendOtpViaEmail");
const buyerPerma_1 = require("../../../../../models/buyer/schema/buyerPerma");
const buyerForgotPasswordTemp_1 = require("../../../../../models/buyer/schema/buyerForgotPasswordTemp");
const sendOtpViaPhone_1 = require("./helpers/sendOtpViaPhone");
const resendForgotPasswordOtp = (0, utils_1.async_error_handler)(async (req, res, next) => {
    const buyer = await buyerPerma_1.BuyerModelPerma.findById(req.forgotPasswordBuyer.buyerId);
    if (!buyer)
        throw new utils_1.Custom_error({
            errors: [{ message: 'noSuchUser' }],
            statusCode: 404,
        });
    if (req.forgotPasswordBuyer.isExpired)
        throw new utils_1.Custom_error({
            errors: [{ message: 'otpExpired' }],
            statusCode: 401,
        });
    if (req.forgotPasswordBuyer.otpSentTimes == 3) {
        throw new utils_1.Custom_error({
            errors: [{ message: 'tryAfterSomeTime' }],
            statusCode: 400,
        });
    }
    let otp;
    console.log('himanshu');
    if (req.forgotPasswordBuyer.isEmail) {
        otp = await (0, sendOtpViaEmail_1.sendOtpViaEmail)(buyer.name, buyer.email, buyer.phoneNumber);
    }
    else {
        otp = await (0, sendOtpViaPhone_1.sendOtpViaPhone)(buyer.name, buyer.email, buyer.phoneNumber);
    }
    const jwt = await (0, utils_1.createJwt)({
        payload: { _id: req.forgotPasswordBuyer._id },
        options: { expiresIn: process.env.MAX_PASSWORD_CHANGE_TIME },
    }, process.env.FORGOT_PASSWORD_OTP_SECRET);
    await buyerForgotPasswordTemp_1.BuyerForgotPasswordTempModel.findByIdAndUpdate(req.forgotPasswordBuyer._id, {
        $set: {
            otp: otp,
            otpJwt: jwt,
            expiresAt: (0, buyerForgotPasswordTemp_1.calculateExpiry)(),
            createdAt: Date.now(),
            otpSentTimes: req.forgotPasswordBuyer?.otpSentTimes + 1,
        },
    });
    const response = new utils_1.Custom_response(true, null, { token: jwt }, 'success', 200, null);
    res.status(response.statusCode).json(response);
});
exports.resendForgotPasswordOtp = resendForgotPasswordOtp;
