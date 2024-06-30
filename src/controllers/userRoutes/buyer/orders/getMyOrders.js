"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyOrders = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const buyerPerma_1 = require("../../../../models/buyer/schema/buyerPerma");
const getMyOrders = (0, utils_1.async_error_handler)(async (req, res, next) => {
    const userWithOrders = await buyerPerma_1.BuyerModelPerma.findById(req.buyer?._id).populate('transactions.orderId');
    const response = new utils_1.Custom_response(true, null, {
        orders: userWithOrders?.transactions,
    }, 'success', 200, null);
    res.status(response.statusCode).json(response);
});
exports.getMyOrders = getMyOrders;
