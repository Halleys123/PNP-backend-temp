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
exports.BuyerModelPerma = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const BuyerSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    phoneNumber: { type: String, required: true, unique: true },
    createdOn: { type: Date, required: true, default: Date.now },
    address: [
        {
            houseNumber: { type: String, required: true },
            street: { type: String, required: true },
            city: { type: String, required: true },
            pincode: { type: String, required: true },
        },
    ],
    transactions: {
        type: [
            {
                transactionId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Transaction' },
                orderId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Order' },
            },
        ],
    },
    sessions: { type: [mongoose_1.Schema.Types.ObjectId], ref: 'Session' },
    cart: {
        type: [
            {
                productId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Product' },
                quantity: { type: Number },
            },
        ],
    },
});
BuyerSchema.statics.build = function (buyerAttributes) {
    return new this(buyerAttributes);
};
const BuyerModel = mongoose_1.default.model('BuyerPerma', BuyerSchema);
exports.BuyerModelPerma = BuyerModel;
