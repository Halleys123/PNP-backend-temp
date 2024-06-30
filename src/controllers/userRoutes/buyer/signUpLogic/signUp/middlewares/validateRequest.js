"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const buyerTemp_1 = require("../../../../../../models/buyer/schema/buyerTemp");
const buyerPerma_1 = require("../../../../../../models/buyer/schema/buyerPerma");
const validateRequest = (0, utils_1.async_error_handler)(async (req, res, next) => {
    const { name, email, phoneNumber, address, password } = req.body;
    if (!name)
        throw new utils_1.Custom_error({
            errors: [{ message: 'sendName' }],
            statusCode: 400,
        });
    if (!email)
        throw new utils_1.Custom_error({
            errors: [{ message: 'sendEmail' }],
            statusCode: 400,
        });
    if (!password)
        throw new utils_1.Custom_error({
            errors: [{ message: 'sendPassword' }],
            statusCode: 400,
        });
    if (!phoneNumber)
        throw new utils_1.Custom_error({
            errors: [{ message: 'sendPhoneNumber' }],
            statusCode: 400,
        });
    const existingUserPhoneTemp = await buyerTemp_1.BuyerModelTemp.findOne({
        phoneNumber,
    });
    const state = { isPhoneActive: true, isEmailActive: true };
    if (existingUserPhoneTemp) {
        if (new Date(existingUserPhoneTemp.phoneOtp.expiresAt) >
            new Date(Date.now())) {
            throw new utils_1.Custom_error({
                errors: [{ message: 'userWithThisPhoneAlreadyExit' }],
                statusCode: 400,
            });
        }
        else {
            state.isPhoneActive = false;
            console.log('Phone');
        }
    }
    const existingUserEmailTemp = await buyerTemp_1.BuyerModelTemp.findOne({
        email,
    });
    if (existingUserEmailTemp) {
        if (new Date(existingUserEmailTemp.emailOtp.expiresAt) >
            new Date(Date.now())) {
            throw new utils_1.Custom_error({
                errors: [{ message: 'userWithThisEmailAlreadyExit' }],
                statusCode: 400,
            });
        }
        else {
            state.isEmailActive = false;
            console.log('Email');
        }
    }
    console.log(state);
    if (!state.isEmailActive) {
        if (new Date(existingUserEmailTemp?.phoneOtp.expiresAt) >
            new Date(Date.now()))
            throw new utils_1.Custom_error({
                errors: [{ message: 'userWithThisEmailAlreadyExit' }],
                statusCode: 400,
            });
        await buyerTemp_1.BuyerModelTemp.deleteOne({ email });
    }
    if (!state.isPhoneActive) {
        if (new Date(existingUserPhoneTemp?.phoneOtp.expiresAt) >
            new Date(Date.now()))
            throw new utils_1.Custom_error({
                errors: [{ message: 'userWithThisPhoneAlreadyExit' }],
                statusCode: 400,
            });
        await buyerTemp_1.BuyerModelTemp.deleteOne({ phoneNumber });
    }
    const existingUserEmailPerma = await buyerPerma_1.BuyerModelPerma.findOne({ email });
    const existingUserPhonePerma = await buyerPerma_1.BuyerModelPerma.findOne({
        phoneNumber,
    });
    if (existingUserPhonePerma)
        throw new utils_1.Custom_error({
            errors: [{ message: 'userWithThisPhoneAlreadyExit' }],
            statusCode: 400,
        });
    if (existingUserEmailPerma)
        throw new utils_1.Custom_error({
            errors: [{ message: 'userWithThisEmailAlreadyExit' }],
            statusCode: 400,
        });
    next();
});
exports.validateRequest = validateRequest;
