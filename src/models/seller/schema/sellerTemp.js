"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SellerModelTemp = void 0;
exports.calculateExpiry = calculateExpiry;
const mongoose_1 = __importStar(require("mongoose"));
const types_1 = require("../../../types/types");
function calculateExpiry() {
    const expiresIn = process.env.SIGNUP_OTP_TIME;
    return new Date(Date.now() +
        1000 * 60 * parseInt(expiresIn.substring(0, expiresIn.length - 1)));
}
const SellerSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: {
        houseNumber: { type: String, required: true },
        street: { type: String, required: true },
        city: { type: String, required: true },
        pincode: { type: String, required: true },
    },
    accountInfo: {
        accountType: {
            type: String,
            enum: Object.values(types_1.accountType),
            required: true,
        },
        GSTIN: { type: String },
        outlet: { type: String },
        shopName: { type: String },
        businessRegistrationNumber: { type: String, unique: true },
    },
    bankAccount: {
        accountNumber: { type: String, required: true },
        ifscCode: { type: String, required: true },
        accountHolderName: { type: String, required: true },
        bankName: { type: String, required: true },
        branchName: { type: String, required: true },
    },
    phoneOtp: {
        otp: { type: String, required: true },
        isVerified: { type: Boolean, required: true, default: false },
        isExpired: { type: Boolean, required: true, default: false },
        createdAt: { type: Date, required: true, default: Date.now },
        expiresAt: { type: Date, required: true, default: calculateExpiry },
        otpSentTimes: { type: Number, required: true, default: 0 },
    },
    emailOtp: {
        otp: { type: String, required: true },
        isVerified: { type: Boolean, required: true, default: true },
        isExpired: { type: Boolean, required: true, default: false },
        createdAt: { type: Date, required: true, default: Date.now },
        expiresAt: { type: Date, required: true, default: calculateExpiry },
        otpSentTimes: { type: Number, required: true, default: 0 },
    },
    deviceFingerprint: { type: String, required: true },
    otpJwt: { type: String, required: true },
});
SellerSchema.statics.build = function (sellerAttributesTemp) {
    return new this(sellerAttributesTemp);
};
const SellerModel = mongoose_1.default.model('SellerTemp', SellerSchema);
exports.SellerModelTemp = SellerModel;
