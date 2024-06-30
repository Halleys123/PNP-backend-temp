"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeProduct = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const buyerPerma_1 = require("../../../../models/buyer/schema/buyerPerma");
const removeProduct = (0, utils_1.async_error_handler)(async (req, res, next) => {
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
    await buyerPerma_1.BuyerModelPerma.findByIdAndUpdate(req.buyer._id, {
        $set: { cart: req.buyer.cart },
    });
    const response = new utils_1.Custom_response(true, null, 'removedFromCart', 'success', 200, null);
    res.status(response.statusCode).json(response);
});
exports.removeProduct = removeProduct;
