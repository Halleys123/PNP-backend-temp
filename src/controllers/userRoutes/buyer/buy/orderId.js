"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrderId = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const server_1 = require("../../../../server");
const types_1 = require("../../../../types/types");
const createOrderId = (0, utils_1.async_error_handler)(async (req, res, next) => {
    if (req.order.orderType != types_1.OrderType.ONLINE_PAYMENT)
        throw new utils_1.Custom_error({
            errors: [{ message: 'notSetToOnlinePayment' }],
            statusCode: 400,
        });
    console.log(req.order);
    const amount = req.order.amount * 100;
    console.log(amount);
    var options = {
        amount: amount,
        currency: 'INR',
        receipt: 'rcp1',
    };
    server_1.razorpayInstance.orders.create(options, function (err, order) {
        console.log(err);
        if (!err) {
            const response = new utils_1.Custom_response(true, null, { orderId: order.id }, 'success', 200, null);
            res.status(response.statusCode).json(response);
        }
        else {
            throw new utils_1.Custom_error({
                errors: [{ message: JSON.stringify(err.error) }],
                statusCode: 400,
            });
        }
    });
});
exports.createOrderId = createOrderId;
