"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUnverifiedProducts = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const products_1 = require("../../../../models/products/schema/products");
const types_1 = require("../../../../types/types");
const getUnverifiedProducts = (0, utils_1.async_error_handler)(async (req, res, next) => {
    const { pageNo = 1, pageSize = 10 } = req.query;
    let parsedPageNo = parseInt(pageNo.toString());
    let parsedPageSize = parseInt(pageSize.toString());
    const unverifiedProducts = await products_1.ProductModel.find({
        "verificationDetails.verificationStatus": types_1.productVerificationStatus.PENDING,
    }).populate("sellerId", {
        name: true,
        email: true,
        phone: true,
        address: true,
    });
    const length = unverifiedProducts.length;
    const paginatedProducts = unverifiedProducts.splice((parsedPageNo - 1) * parsedPageSize, parsedPageSize);
    const response = new utils_1.Custom_response(true, null, {
        unverifiedProducts: paginatedProducts,
        totalProducts: length,
    }, "success", 200, null);
    res.status(response.statusCode).json(response);
});
exports.getUnverifiedProducts = getUnverifiedProducts;
