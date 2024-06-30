"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onlinePayment = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const types_1 = require("../../../../types/types");
const orders_1 = require("../../../../models/orders/schema/orders");
const onlinePayment = (0, utils_1.async_error_handler)(async (req, res, next) => {
    if (req.order?.orderType) {
        throw new utils_1.Custom_error({
            errors: [{ message: 'orderTypeAlreadySet' }],
            statusCode: 400,
        });
    }
    await orders_1.OrderModel.findByIdAndUpdate(req.order._id, {
        $set: {
            orderType: types_1.OrderType.ONLINE_PAYMENT,
        },
    });
    const response = new utils_1.Custom_response(true, null, 'setToPayOnline', 'success', 200, null);
    res.status(response.statusCode).json(response);
});
exports.onlinePayment = onlinePayment;
