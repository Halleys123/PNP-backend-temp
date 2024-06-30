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
exports.cashOnDelivery = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const types_1 = require("../../../../types/types");
const orders_1 = require("../../../../models/orders/schema/orders");
const cashOnDelivery = (0, utils_1.async_error_handler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if ((_a = req.order) === null || _a === void 0 ? void 0 : _a.orderType) {
        throw new utils_1.Custom_error({
            errors: [{ message: 'orderTypeAlreadySet' }],
            statusCode: 400,
        });
    }
    yield orders_1.OrderModel.findByIdAndUpdate(req.order._id, {
        $set: {
            orderType: types_1.OrderType.CASH_ON_DELIVERY,
            orderStatus: types_1.OrderStatus.PROCESSED,
        },
    });
    const response = new utils_1.Custom_response(true, null, 'setToCashOnDelivery', 'success', 200, null);
    res.status(response.statusCode).json(response);
}));
exports.cashOnDelivery = cashOnDelivery;
