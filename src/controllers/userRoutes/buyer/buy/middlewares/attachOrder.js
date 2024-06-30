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
exports.attachOrder = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const types_1 = require("../../../../../types/types");
const orders_1 = require("../../../../../models/orders/schema/orders");
const attachOrder = (0, utils_1.async_error_handler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
    const decodedToken = (yield (0, utils_1.jwtVerification)(transactionJwt.split(' ')[1], process.env.TRANSACTION_TOKEN_SECRET));
    const order = yield orders_1.OrderModel.findById(decodedToken._id);
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
}));
exports.attachOrder = attachOrder;
