"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addProduct = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const products_1 = require("../../../../models/products/schema/products");
const buyerPerma_1 = require("../../../../models/buyer/schema/buyerPerma");
const addProduct = (0, utils_1.async_error_handler)(async (req, res, next) => {
    const { productId, quantity } = req.body;
    const product = await products_1.ProductModel.findById(productId);
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
    await buyerPerma_1.BuyerModelPerma.findByIdAndUpdate(req.buyer._id, {
        $push: { cart: { productId, quantity } },
    });
    const response = new utils_1.Custom_response(true, null, 'addedSuccessfullyToCart', 'success', 200, null);
    res.status(response.statusCode).json(response);
});
exports.addProduct = addProduct;
