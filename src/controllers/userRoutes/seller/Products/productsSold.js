"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductsSold = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const sellerPerma_1 = require("../../../../models/seller/schema/sellerPerma");
const getProductsSold = (0, utils_1.async_error_handler)(async (req, res, next) => {
    const sellerId = req.seller._id; // Assuming req.seller!._id is the seller's ID
    const seller = await sellerPerma_1.SellerModelPerma.findById(sellerId)
        .populate({
        path: "productsSold.productId",
        model: "Product",
    })
        .populate({
        path: "productsSold.orderId",
        model: "Order",
    });
    const productsSold = seller?.productsSold; // Array of populated productsSold
    const response = new utils_1.Custom_response(true, null, productsSold, "success", 200, null);
    res.status(response.statusCode).json(response);
});
exports.getProductsSold = getProductsSold;
