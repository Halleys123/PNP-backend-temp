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
exports.getProductsSold = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const sellerPerma_1 = require("../../../../models/seller/schema/sellerPerma");
const getProductsSold = (0, utils_1.async_error_handler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const sellerId = req.seller._id; // Assuming req.seller!._id is the seller's ID
    const seller = yield sellerPerma_1.SellerModelPerma.findById(sellerId)
        .populate({
        path: "productsSold.productId",
        model: "Product",
    })
        .populate({
        path: "productsSold.orderId",
        model: "Order",
    });
    const productsSold = seller === null || seller === void 0 ? void 0 : seller.productsSold; // Array of populated productsSold
    const response = new utils_1.Custom_response(true, null, productsSold, "success", 200, null);
    res.status(response.statusCode).json(response);
}));
exports.getProductsSold = getProductsSold;
