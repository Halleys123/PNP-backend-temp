"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCartDetails = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const buyerPerma_1 = require("../../../../models/buyer/schema/buyerPerma");
const getCartDetails = (0, utils_1.async_error_handler)(async (req, res, next) => {
    const populatedCart = await buyerPerma_1.BuyerModelPerma.findById(req.buyer._id).populate({ path: 'cart' });
    const response = new utils_1.Custom_response(true, null, { cart: populatedCart?.cart }, 'success', 200, null);
    res.status(response.statusCode).json(response);
});
exports.getCartDetails = getCartDetails;
