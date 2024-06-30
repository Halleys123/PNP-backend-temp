"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderById = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const orders_1 = require("../../../../models/orders/schema/orders");
const getOrderById = (0, utils_1.async_error_handler)(async (req, res, next) => {
    const id = req.query.id;
    if (!id)
        throw new utils_1.Custom_error({
            errors: [{ message: 'sendId' }],
            statusCode: 400,
        });
    const order = await orders_1.OrderModel.findById(id.toString()).populate('placedBy');
    if (!order)
        throw new utils_1.Custom_error({
            errors: [{ message: 'noSuchOrder' }],
            statusCode: 404,
        });
    const response = new utils_1.Custom_response(true, null, { order: order }, 'success', 200, null);
    res.status(response.statusCode).json(response);
});
exports.getOrderById = getOrderById;
