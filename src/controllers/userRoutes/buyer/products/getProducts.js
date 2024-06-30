"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProducts = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const products_1 = require("../../../../models/products/schema/products");
const types_1 = require("../../../../types/types");
const getProducts = (0, utils_1.async_error_handler)(async (req, res, next) => {
    const { pageNo = 1 } = req.query;
    const pageSize = 4;
    const parsedPageNo = parseInt(pageNo.toString());
    const products = await products_1.ProductModel.find({
        "verificationDetails.verificationStatus": types_1.productVerificationStatus.ACCEPTED,
    });
    const totalProducts = products.length;
    const paginatedProducts = products.splice((parsedPageNo - 1) * pageSize, pageSize);
    const response = new utils_1.Custom_response(true, null, { products: paginatedProducts, totalProducts }, "success", 200, null);
    res.status(response.statusCode).json(response);
});
exports.getProducts = getProducts;
