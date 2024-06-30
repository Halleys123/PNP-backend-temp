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
exports.getProducts = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const products_1 = require("../../../../models/products/schema/products");
const types_1 = require("../../../../types/types");
const getProducts = (0, utils_1.async_error_handler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { pageNo = 1 } = req.query;
    const pageSize = 4;
    const parsedPageNo = parseInt(pageNo.toString());
    const products = yield products_1.ProductModel.find({
        "verificationDetails.verificationStatus": types_1.productVerificationStatus.ACCEPTED,
    });
    const totalProducts = products.length;
    const paginatedProducts = products.splice((parsedPageNo - 1) * pageSize, pageSize);
    const response = new utils_1.Custom_response(true, null, { products: paginatedProducts, totalProducts }, "success", 200, null);
    res.status(response.statusCode).json(response);
}));
exports.getProducts = getProducts;
