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
exports.removeProduct = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const buyerPerma_1 = require("../../../../models/buyer/schema/buyerPerma");
const removeProduct = (0, utils_1.async_error_handler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.body.productId;
    if (!productId)
        throw new utils_1.Custom_error({
            errors: [{ message: 'sendTheProductId' }],
            statusCode: 400,
        });
    let i;
    for (i = 0; i < req.buyer.cart.length; i++) {
        if (req.buyer.cart[i].productId.toString() == productId) {
            console.log('hdjhfd');
            break;
        }
    }
    req.buyer.cart.splice(i, 1);
    console.log(req.buyer);
    yield buyerPerma_1.BuyerModelPerma.findByIdAndUpdate(req.buyer._id, {
        $set: { cart: req.buyer.cart },
    });
    const response = new utils_1.Custom_response(true, null, 'removedFromCart', 'success', 200, null);
    res.status(response.statusCode).json(response);
}));
exports.removeProduct = removeProduct;
