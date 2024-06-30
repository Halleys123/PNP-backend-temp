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
exports.deliveryDone = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const types_1 = require("../../../types/types");
const orders_1 = require("../../../models/orders/schema/orders");
const deliveryDone = (0, utils_1.async_error_handler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.body.orderId;
    if (!orderId)
        throw new utils_1.Custom_error({
            errors: [{ message: 'sendOrderId' }],
            statusCode: 400,
        });
    const order = yield orders_1.OrderModel.findById(orderId);
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
    if (order.deliveryStatus != types_1.DeliveryStatus.ON_THE_GO)
        throw new utils_1.Custom_error({
            errors: [{ message: 'orderNotInitiated' }],
            statusCode: 400,
        });
    yield orders_1.OrderModel.findByIdAndUpdate(order._id, {
        $set: {
            isDroppedCompletely: true,
            deliveryStatus: types_1.DeliveryStatus.DELIVERED,
        },
    });
    const response = new utils_1.Custom_response(true, null, 'deliveryDone', 'success', 200, null);
    res.status(response.statusCode).json(response);
}));
exports.deliveryDone = deliveryDone;
