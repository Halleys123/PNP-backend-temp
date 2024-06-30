"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductById = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const products_1 = require("../../../../models/products/schema/products");
const getProductById = (0, utils_1.async_error_handler)(async (req, res, next) => {
    const { id } = req.query;
    if (!id) {
        throw new utils_1.Custom_error({
            errors: [{ message: "sendTheId" }],
            statusCode: 400,
        });
    }
    const product = await products_1.ProductModel.findById(id).populate("sellerId", {
        password: false,
        sessions: false,
        address: false,
        productsSold: false,
        products: false,
        createdOn: false,
    });
    if (!product) {
        throw new utils_1.Custom_error({
            errors: [{ message: "productNotFound" }],
            statusCode: 404,
        });
    }
    const response = new utils_1.Custom_response(true, null, { product }, "success", 200, null);
    res.status(response.statusCode).json(response);
});
exports.getProductById = getProductById;
