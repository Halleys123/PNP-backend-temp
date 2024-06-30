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
exports.topProducts = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const types_1 = require("../../../../types/types");
const orders_1 = require("../../../../models/orders/schema/orders");
const products_1 = require("../../../../models/products/schema/products");
const topProducts = (0, utils_1.async_error_handler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { pageNo = 1, pageSize = 10, from, to, isDelivered, orderType, sortBy, } = req.query;
    let parsedPageNo = parseInt(pageNo.toString());
    let parsedPageSize = parseInt(pageSize.toString());
    const filters = {};
    if (from)
        filters["startTime"] = { $gte: new Date(from.toString()) };
    if (to) {
        if (filters["startTime"])
            filters["startTime"]["$lte"] = new Date(to.toString());
        else
            filters["startTime"] = { $lte: new Date(to.toString()) };
    }
    if (isDelivered) {
        if (isDelivered == "true")
            filters["isDroppedCompletely"] = true;
        else if (isDelivered == "false")
            filters["isDroppedCompletely"] = false;
    }
    if (orderType)
        filters["orderType"] = orderType;
    filters["orderStatus"] = types_1.OrderStatus.PROCESSED;
    const transactions = req.seller.productsSold;
    const topProductsMap = {};
    for (let i = 0; i < transactions.length; i++) {
        filters["_id"] = transactions[i].orderId;
        const order = yield orders_1.OrderModel.findOne(filters);
        if (order) {
            const productToString = transactions[i].productId.toString();
            if (topProductsMap[productToString]) {
                topProductsMap[productToString].quantitySold +=
                    transactions[i].quantitySold;
                topProductsMap[productToString].totalPrice +=
                    transactions[i].totalPrice;
            }
            else {
                topProductsMap[productToString] = {
                    quantitySold: transactions[i].quantitySold,
                    totalPrice: transactions[i].totalPrice,
                    productId: productToString,
                };
            }
        }
    }
    const topProducts = Object.values(topProductsMap);
    topProducts.sort((a, b) => {
        if (sortBy == "quantitySold")
            return b.quantitySold - a.quantitySold;
        else
            return b.totalPrice - a.totalPrice;
    });
    const populatedTopProducts = yield Promise.all(topProducts.map((elem) => __awaiter(void 0, void 0, void 0, function* () {
        const product = yield products_1.ProductModel.findById(elem.productId);
        return {
            product,
            quantitySold: elem.quantitySold,
            totalPrice: elem.totalPrice,
        };
    })));
    const length = populatedTopProducts.length;
    const paginatedProducts = populatedTopProducts.slice((parsedPageNo - 1) * parsedPageSize, parsedPageNo * parsedPageSize);
    console.log(paginatedProducts);
    const response = new utils_1.Custom_response(true, null, { topProducts: paginatedProducts, totalProducts: length }, "success", 200, null);
    res.status(response.statusCode).json(response);
}));
exports.topProducts = topProducts;
