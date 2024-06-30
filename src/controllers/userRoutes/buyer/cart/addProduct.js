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
exports.addProduct = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const products_1 = require("../../../../models/products/schema/products");
const buyerPerma_1 = require("../../../../models/buyer/schema/buyerPerma");
const addProduct = (0, utils_1.async_error_handler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId, quantity } = req.body;
    const product = yield products_1.ProductModel.findById(productId);
    if (!product)
        throw new utils_1.Custom_error({
            errors: [{ message: 'noSuchProduct' }],
            statusCode: 404,
        });
    if (product.stock == 0)
        throw new utils_1.Custom_error({
            errors: [{ message: 'outOfStock' }],
            statusCode: 400,
        });
    for (let i = 0; i < req.buyer.cart.length; i++) {
        if (req.buyer.cart[i].productId == productId)
            throw new utils_1.Custom_error({
                errors: [{ message: 'alreadyInYourCart' }],
                statusCode: 200,
            });
    }
    if (!quantity)
        throw new utils_1.Custom_error({
            errors: [{ message: 'sendTheQuantity' }],
            statusCode: 400,
        });
    yield buyerPerma_1.BuyerModelPerma.findByIdAndUpdate(req.buyer._id, {
        $push: { cart: { productId, quantity } },
    });
    const response = new utils_1.Custom_response(true, null, 'addedSuccessfullyToCart', 'success', 200, null);
    res.status(response.statusCode).json(response);
}));
exports.addProduct = addProduct;
