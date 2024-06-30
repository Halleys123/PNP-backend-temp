"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const sellerTemp_1 = require("../../../../../../models/seller/schema/sellerTemp");
const sellerPerma_1 = require("../../../../../../models/seller/schema/sellerPerma");
const types_1 = require("../../../../../../types/types");
const validateRequest = (0, utils_1.async_error_handler)(async (req, res, next) => {
    const { name, email, phoneNumber, address, password, accountInfo, bankAccount, } = req.body;
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
    if (!address ||
        !address.houseNumber ||
        !address.street ||
        !address.city ||
        !address.pincode)
        throw new utils_1.Custom_error({
            errors: [{ message: 'sendCompleteAddress' }],
            statusCode: 400,
        });
    const existingUserPhoneTemp = await sellerTemp_1.SellerModelTemp.findOne({
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
    const existingUserEmailTemp = await sellerTemp_1.SellerModelTemp.findOne({
        email,
    });
    if (existingUserEmailTemp) {
        if (new Date(existingUserEmailTemp.emailOtp.expiresAt) >
            new Date(Date.now())) {
            throw new utils_1.Custom_error({
                errors: [{ message: 'userWithThisPhoneAlreadyExit' }],
                statusCode: 400,
            });
        }
        else {
            state.isEmailActive = false;
            console.log('Email');
        }
    }
    if (!state.isEmailActive && !state.isPhoneActive)
        await sellerTemp_1.SellerModelTemp.deleteOne({ email });
    const existingUserEmailPerma = await sellerPerma_1.SellerModelPerma.findOne({ email });
    const existingUserPhonePerma = await sellerPerma_1.SellerModelPerma.findOne({
        phoneNumber,
    });
    if (existingUserPhonePerma)
        throw new utils_1.Custom_error({
            errors: [{ message: 'userAlreadyExist' }],
            statusCode: 400,
        });
    if (existingUserEmailPerma)
        throw new utils_1.Custom_error({
            errors: [{ message: 'userAlreadyExist' }],
            statusCode: 400,
        });
    if (!accountInfo)
        throw new utils_1.Custom_error({
            errors: [{ message: 'accountInfoRequired' }],
            statusCode: 400,
        });
    if (!accountInfo.accountType)
        throw new utils_1.Custom_error({
            errors: [{ message: 'accountTypeRequired' }],
            statusCode: 400,
        });
    if (accountInfo.accountType == types_1.accountType.BUSINESS &&
        (!accountInfo.shopName ||
            !accountInfo.outlet ||
            !accountInfo.GSTIN ||
            !accountInfo.businessRegistrationNumber))
        throw new utils_1.Custom_error({
            errors: [
                { message: 'accountInfoNotComplete' },
                {
                    message: `These are the required fields for a business account
              !accountInfo.shopName ||
              !accountInfo.outlet ||
              !accountInfo.GSTIN ||
              !accountInfo.businessRegistrationNumber`,
                },
            ],
            statusCode: 400,
        });
    const sameGstNumberTemp = await sellerTemp_1.SellerModelTemp.findOne({
        'accountInfo.GSTIN': accountInfo.GSTIN,
    });
    const sameBusinesssRegNoTemp = await sellerTemp_1.SellerModelTemp.findOne({
        'accountInfo.businessRegistrationNumber': accountInfo.businessRegistrationNumber,
    });
    const sameGstNumberPerma = await sellerPerma_1.SellerModelPerma.findOne({
        'accountInfo.GSTIN': accountInfo.GSTIN,
    });
    const sameBusinesssRegNoPerma = await sellerPerma_1.SellerModelPerma.findOne({
        'accountInfo.businessRegistrationNumber': accountInfo.businessRegistrationNumber,
    });
    if (sameBusinesssRegNoPerma || sameBusinesssRegNoTemp)
        throw new utils_1.Custom_error({
            errors: [{ message: 'businessRegNoAlreadyExist' }],
            statusCode: 400,
        });
    if (sameGstNumberPerma || sameGstNumberTemp)
        throw new utils_1.Custom_error({
            errors: [{ message: 'GSTNoAlreadyExist' }],
            statusCode: 400,
        });
    if (!bankAccount)
        throw new utils_1.Custom_error({
            errors: [{ message: 'bankInfoRequired' }],
            statusCode: 400,
        });
    if (!bankAccount.accountNumber ||
        !bankAccount.ifscCode ||
        !bankAccount.accountHolderName ||
        !bankAccount.bankName ||
        !bankAccount.branchName)
        throw new utils_1.Custom_error({
            errors: [
                { message: 'bankAccountInfoNotComplete' },
                {
                    message: `These are the required fields for bank account 
            !bankAccount.accountNumber ||
            !bankAccount.ifscCode ||
            !bankAccount.accountHolderName ||
            !bankAccount.bankName ||
            !bankAccount.branchName`,
                },
            ],
            statusCode: 400,
        });
    next();
});
exports.validateRequest = validateRequest;
