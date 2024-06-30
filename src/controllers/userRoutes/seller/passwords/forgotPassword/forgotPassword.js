"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPassword = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const sellerPerma_1 = require("../../../../../models/seller/schema/sellerPerma");
const sellerForgotPasswordTemp_1 = require("../../../../../models/seller/schema/sellerForgotPasswordTemp");
const sendOtpViaPhone_1 = require("./helpers/sendOtpViaPhone");
const sendOtpViaEmail_1 = require("./helpers/sendOtpViaEmail");
const isPhoneNumber = (input) => {
    const phoneRegex = /^[0-9]{10,15}$/;
    return phoneRegex.test(input);
};
const forgotPassword = (0, utils_1.async_error_handler)(async (req, res, next) => {
    const { emailOrPhone } = req.body;
    if (!emailOrPhone)
        throw new utils_1.Custom_error({
            errors: [{ message: 'sendEmailOrPhone' }],
            statusCode: 400,
        });
    let seller;
    let isEmail = false;
    let otp;
    if (isPhoneNumber(emailOrPhone)) {
        seller = await sellerPerma_1.SellerModelPerma.findOne({
            phoneNumber: emailOrPhone,
        });
        isEmail = false;
        if (!seller)
            throw new utils_1.Custom_error({
                errors: [{ message: 'noUserWithThisPhone' }],
                statusCode: 404,
            });
    }
    else {
        seller = await sellerPerma_1.SellerModelPerma.findOne({
            email: emailOrPhone,
        });
        isEmail = true;
        if (!seller)
            throw new utils_1.Custom_error({
                errors: [{ message: 'noUserWithThisEmail' }],
                statusCode: 404,
            });
    }
    const forgotPasswordInitiatedFirstSeller = await sellerForgotPasswordTemp_1.SellerForgotPasswordTempModel.findOne({ sellerId: seller._id });
    if (forgotPasswordInitiatedFirstSeller) {
        if (new Date(forgotPasswordInitiatedFirstSeller.expiresAt) >
            new Date(Date.now()))
            throw new utils_1.Custom_error({
                errors: [{ message: 'forgotPasswordAlreadyInitiated' }],
                statusCode: 400,
            });
        else
            await sellerForgotPasswordTemp_1.SellerForgotPasswordTempModel.findByIdAndDelete(forgotPasswordInitiatedFirstSeller._id);
    }
    if (isEmail) {
        otp = await (0, sendOtpViaEmail_1.sendOtpViaEmail)(seller.name, seller.email, seller.phoneNumber);
    }
    else {
        otp = await (0, sendOtpViaPhone_1.sendOtpViaPhone)(seller.name, seller.email, seller.phoneNumber);
    }
    const forgotPasswordSeller = sellerForgotPasswordTemp_1.SellerForgotPasswordTempModel.build({
        isEmail: isEmail,
        sendTo: emailOrPhone,
        sellerId: seller._id,
        otp: otp,
        deviceFingerprint: await (0, utils_1.hashPassword)(req.device?.deviceFingerprint),
    });
    await forgotPasswordSeller.save();
    const jwt = await (0, utils_1.createJwt)({
        payload: { _id: forgotPasswordSeller._id },
        options: { expiresIn: process.env.MAX_PASSWORD_CHANGE_TIME },
    }, process.env.FORGOT_PASSWORD_OTP_SECRET);
    await sellerForgotPasswordTemp_1.SellerForgotPasswordTempModel.findByIdAndUpdate(forgotPasswordSeller._id, { $set: { otpJwt: jwt } });
    const response = new utils_1.Custom_response(true, null, { token: jwt }, 'success', 200, null);
    res.status(response.statusCode).json(response);
});
exports.forgotPassword = forgotPassword;
