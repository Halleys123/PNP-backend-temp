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
exports.SellerModelPerma = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const types_1 = require("../../../types/types");
const SellerSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {
        select: false,
        type: String,
        required: true,
    },
    phoneNumber: { type: String, required: true, unique: true },
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
        businessRegistrationNumber: { type: String },
    },
    bankAccount: {
        accountNumber: { type: String, required: true, select: false },
        ifscCode: { type: String, required: true, select: false },
        accountHolderName: { type: String, required: true, select: false },
        bankName: { type: String, required: true, select: false },
        branchName: { type: String, required: true, select: false },
    },
    createdOn: { type: Date, default: Date.now },
    products: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: 'Product',
    },
    productsSold: {
        type: [
            {
                type: {
                    productId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Product' },
                    quantitySold: { type: Number },
                    orderId: {
                        type: mongoose_1.Schema.Types.ObjectId,
                        ref: 'Order',
                    },
                    totalPrice: { type: Number },
                },
            },
        ],
    },
    sessions: { type: [mongoose_1.Schema.Types.ObjectId], ref: 'Session' },
});
SellerSchema.statics.build = function (sellerAttributes) {
    return new this(sellerAttributes);
};
const SellerModel = mongoose_1.default.model('SellerPerma', SellerSchema);
exports.SellerModelPerma = SellerModel;
