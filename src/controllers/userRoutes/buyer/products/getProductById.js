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
exports.getProductById = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const products_1 = require("../../../../models/products/schema/products");
const getProductById = (0, utils_1.async_error_handler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    if (!id) {
        throw new utils_1.Custom_error({
            errors: [{ message: "sendTheId" }],
            statusCode: 400,
        });
    }
    const product = yield products_1.ProductModel.findById(id).populate("sellerId", {
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
}));
exports.getProductById = getProductById;
