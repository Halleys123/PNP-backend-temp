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
exports.OrderModel = void 0;
exports.calculateExpiry = calculateExpiry;
const mongoose_1 = __importStar(require("mongoose"));
const types_1 = require("../../../types/types");
function calculateExpiry() {
    const expiresIn = process.env.MAX_TRANSACTION_TIME;
    return new Date(Date.now() +
        1000 * 60 * parseInt(expiresIn.substring(0, expiresIn.length - 1)));
}
const OrderSchema = new mongoose_1.Schema({
    placedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'BuyerPerma', required: true },
    isCompletelyDropped: { type: Boolean, required: true, default: false },
    orderStatus: {
        type: String,
        enum: Object.values(types_1.OrderStatus),
        default: types_1.OrderStatus.PENDING,
    },
    productsBought: [
        {
            isDropped: { type: Boolean, required: true, default: false },
            productId: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            quantityBought: { type: Number },
            totalPrice: { type: Number },
        },
    ],
    delivery: {
        type: {
            trackingId: {
                type: String,
            },
            orderId: {
                type: String,
            },
        },
    },
    deliveryStatus: {
        type: String,
        default: types_1.DeliveryStatus.NOT_INITIATED,
        enum: Object.values(types_1.DeliveryStatus),
        required: true,
    },
    isSorted: { type: Boolean },
    orderType: { type: String, enum: Object.values(types_1.OrderType) },
    transactionId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Transaction' },
    startTime: { type: Date, required: true, default: Date.now },
    expireTime: { type: Date, required: true, default: calculateExpiry },
    amount: { type: Number, required: true },
    dropAddress: {
        houseNumber: { type: String, required: true },
        street: { type: String, required: true },
        city: { type: String, required: true },
        pincode: { type: String, required: true },
    },
});
OrderSchema.statics.build = function (orderAttributes) {
    return new this(orderAttributes);
};
const OrderModel = mongoose_1.default.model('Order', OrderSchema);
exports.OrderModel = OrderModel;
