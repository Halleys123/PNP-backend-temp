"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyProducts = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const sellerPerma_1 = require("../../../../models/seller/schema/sellerPerma");
const getMyProducts = (0, utils_1.async_error_handler)(async (req, res, next) => {
    const userWithProduct = await sellerPerma_1.SellerModelPerma.findById(req.seller._id).populate('products');
    const response = new utils_1.Custom_response(true, null, userWithProduct, 'success', 200, null);
    res.status(response.statusCode).json(response);
});
exports.getMyProducts = getMyProducts;
