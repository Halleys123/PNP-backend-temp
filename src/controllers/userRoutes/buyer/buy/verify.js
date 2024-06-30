"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySignature = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const crypto_1 = __importDefault(require("crypto"));
const schema_1 = require("../../../../models/transactions/schema/schema");
const types_1 = require("../../../../types/types");
const orders_1 = require("../../../../models/orders/schema/orders");
const verifySignature = (0, utils_1.async_error_handler)(async (req, res, next) => {
    console.log(req.body);
    let body = req.body.razorpay_order_id + '|' + req.body.razorpay_payment_id;
    let expectedSignature = crypto_1.default
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');
    console.log(expectedSignature);
    console.log(req.body);
    if (expectedSignature != req.body.razorpay_signature) {
        const transaction = schema_1.TransactionModel.build({
            buyerId: req.buyer._id,
            databaseOrderId: req.order._id,
            amount: req.order.amount,
            transactionStatus: types_1.TransactionStatus.FAILED,
            orderId: req.body.razorpay_order_id,
            paymentId: req.body.razorpay_payment_id,
            paymentSignature: expectedSignature,
        });
        await orders_1.OrderModel.findByIdAndUpdate(req.order._id, {
            transactionId: transaction._id,
            orderStatus: types_1.OrderStatus.FAILED,
        });
        throw new utils_1.Custom_error({
            errors: [{ message: 'signatureNotMatching' }],
            statusCode: 403,
        });
    }
    const transaction = schema_1.TransactionModel.build({
        buyerId: req.buyer._id,
        databaseOrderId: req.order._id,
        amount: req.order.amount,
        transactionStatus: types_1.TransactionStatus.COMPLETED,
        orderId: req.body.razorpay_order_id,
        paymentId: req.body.razorpay_payment_id,
        paymentSignature: expectedSignature,
    });
    await transaction.save();
    await orders_1.OrderModel.findByIdAndUpdate(req.order._id, {
        transactionId: transaction._id,
        orderStatus: types_1.OrderStatus.PROCESSED,
    });
    const response = new utils_1.Custom_response(true, null, 'transactionProcessed', 'success', 200, null);
    res.status(response.statusCode).json(response);
});
exports.verifySignature = verifySignature;
