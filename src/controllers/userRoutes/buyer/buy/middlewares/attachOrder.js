"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachOrder = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const types_1 = require("../../../../../types/types");
const orders_1 = require("../../../../../models/orders/schema/orders");
const attachOrder = (0, utils_1.async_error_handler)(async (req, res, next) => {
    const transactionJwt = req.headers.transaction;
    if (!transactionJwt)
        throw new utils_1.Custom_error({
            errors: [{ message: 'noJwt' }],
            statusCode: 403,
        });
    if (!transactionJwt.startsWith('Bearer'))
        throw new utils_1.Custom_error({
            errors: [{ message: 'invalidJwt' }],
            statusCode: 401,
        });
    const decodedToken = (await (0, utils_1.jwtVerification)(transactionJwt.split(' ')[1], process.env.TRANSACTION_TOKEN_SECRET));
    const order = await orders_1.OrderModel.findById(decodedToken._id);
    if (!order)
        throw new utils_1.Custom_error({
            errors: [{ message: 'noSuchTransaction' }],
            statusCode: 404,
        });
    if (order.orderStatus != types_1.OrderStatus.PENDING)
        throw new utils_1.Custom_error({
            errors: [{ message: 'thisTransactionIsNotPending' }],
            statusCode: 401,
        });
    if (new Date(order.expireTime) < new Date(Date.now()))
        throw new utils_1.Custom_error({
            errors: [{ message: 'orderExpired' }],
            statusCode: 400,
        });
    let found = false;
    for (let i = 0; i < req.buyer.transactions.length; i++) {
        const elem = req.buyer.transactions[i];
        console.log(elem, order._id);
        if (JSON.stringify(elem.orderId) == JSON.stringify(order._id)) {
            found = true;
            break;
        }
    }
    if (found == false)
        throw new utils_1.Custom_error({
            errors: [{ message: 'notYourOrder' }],
            statusCode: 401,
        });
    req.order = order;
    next();
});
exports.attachOrder = attachOrder;
