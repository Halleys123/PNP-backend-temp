"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPassword = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const buyerPerma_1 = require("../../../../../models/buyer/schema/buyerPerma");
const buyerForgotPasswordTemp_1 = require("../../../../../models/buyer/schema/buyerForgotPasswordTemp");
const sendOtpViaPhone_1 = require("./helpers/sendOtpViaPhone");
const sendOtpViaEmail_1 = require("./helpers/sendOtpViaEmail");
const isPhoneNumber = (input) => {
    const phoneRegex = /^[0-9]{10,15}$/;
    return phoneRegex.test(input);
};
const forgotPassword = (0, utils_1.async_error_handler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { emailOrPhone } = req.body;
    if (!emailOrPhone)
        throw new utils_1.Custom_error({
            errors: [{ message: 'sendEmailOrPhone' }],
            statusCode: 400,
        });
    let buyer;
    let isEmail = false;
    let otp;
    if (isPhoneNumber(emailOrPhone)) {
        buyer = yield buyerPerma_1.BuyerModelPerma.findOne({
            phoneNumber: emailOrPhone,
        });
        isEmail = false;
        if (!buyer)
            throw new utils_1.Custom_error({
                errors: [{ message: 'noUserWithThisPhone' }],
                statusCode: 404,
            });
    }
    else {
        buyer = yield buyerPerma_1.BuyerModelPerma.findOne({
            email: emailOrPhone,
        });
        isEmail = true;
        if (!buyer)
            throw new utils_1.Custom_error({
                errors: [{ message: 'noUserWithThisEmail' }],
                statusCode: 404,
            });
    }
    const forgotPasswordInitiatedFirstBuyer = yield buyerForgotPasswordTemp_1.BuyerForgotPasswordTempModel.findOne({ buyerId: buyer._id });
    if (forgotPasswordInitiatedFirstBuyer) {
        if (new Date(forgotPasswordInitiatedFirstBuyer.expiresAt) >
            new Date(Date.now()))
            throw new utils_1.Custom_error({
                errors: [{ message: 'forgotPasswordAlreadyInitiated' }],
                statusCode: 400,
            });
        else
            yield buyerForgotPasswordTemp_1.BuyerForgotPasswordTempModel.findByIdAndDelete(forgotPasswordInitiatedFirstBuyer._id);
    }
    if (isEmail) {
        console.log('Otp Being sent Via email');
        otp = yield (0, sendOtpViaEmail_1.sendOtpViaEmail)(buyer.name, buyer.email, buyer.phoneNumber);
    }
    else {
        console.log('Otp Being sent Via phone');
        otp = yield (0, sendOtpViaPhone_1.sendOtpViaPhone)(buyer.name, buyer.email, buyer.phoneNumber);
    }
    const forgotPasswordBuyer = buyerForgotPasswordTemp_1.BuyerForgotPasswordTempModel.build({
        isEmail: isEmail,
        sendTo: emailOrPhone,
        buyerId: buyer._id,
        otp: otp,
        deviceFingerprint: yield (0, utils_1.hashPassword)((_a = req.device) === null || _a === void 0 ? void 0 : _a.deviceFingerprint),
    });
    yield forgotPasswordBuyer.save();
    const jwt = yield (0, utils_1.createJwt)({
        payload: { _id: forgotPasswordBuyer._id },
        options: { expiresIn: process.env.MAX_PASSWORD_CHANGE_TIME },
    }, process.env.FORGOT_PASSWORD_OTP_SECRET);
    yield buyerForgotPasswordTemp_1.BuyerForgotPasswordTempModel.findByIdAndUpdate(forgotPasswordBuyer._id, { $set: { otpJwt: jwt } });
    const response = new utils_1.Custom_response(true, null, { token: jwt }, 'success', 200, null);
    res.status(response.statusCode).json(response);
}));
exports.forgotPassword = forgotPassword;
