"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initiateDelivery = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const orders_1 = require("../../../models/orders/schema/orders");
const types_1 = require("../../../types/types");
const initiateDelivery = (0, utils_1.async_error_handler)(async (req, res, next) => {
    const orderId = req.body.orderId;
    const order = await orders_1.OrderModel.findById(orderId);
    if (!order)
        throw new utils_1.Custom_error({
            errors: [{ message: 'noSuchOrder' }],
            statusCode: 404,
        });
    if (order.isCompletelyDropped)
        throw new utils_1.Custom_error({
            errors: [{ message: 'alreadyDropped' }],
            statusCode: 404,
        });
    if (order.orderStatus != types_1.OrderStatus.PROCESSED)
        throw new utils_1.Custom_error({
            errors: [{ message: 'orderNotProcessed' }],
            statusCode: 404,
        });
    // TODO::implement the logic to send a request to ekart to deliver product
    await orders_1.OrderModel.findByIdAndUpdate(order._id, {
        $set: {
            delivery: {
                orderId: '123',
                trackingId: 'abc',
            },
        },
    });
    const response = new utils_1.Custom_response(true, null, 'successfullySetToDelivery', 'success', 200, null);
    res.status(response.statusCode).json(response);
});
exports.initiateDelivery = initiateDelivery;
