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
exports.getMyOrders = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const buyerPerma_1 = require("../../../../models/buyer/schema/buyerPerma");
const getMyOrders = (0, utils_1.async_error_handler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userWithOrders = yield buyerPerma_1.BuyerModelPerma.findById((_a = req.buyer) === null || _a === void 0 ? void 0 : _a._id).populate('transactions.orderId');
    const response = new utils_1.Custom_response(true, null, {
        orders: userWithOrders === null || userWithOrders === void 0 ? void 0 : userWithOrders.transactions,
    }, 'success', 200, null);
    res.status(response.statusCode).json(response);
}));
exports.getMyOrders = getMyOrders;
