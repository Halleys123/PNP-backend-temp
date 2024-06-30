"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.topProductsList = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const orders_1 = require("../../../../models/orders/schema/orders");
const types_1 = require("../../../../types/types");
const products_1 = require("../../../../models/products/schema/products");
const topProductsList = (0, utils_1.async_error_handler)(async (req, res, next) => {
    const { pageNo = 1, pageSize = 10, from, to, isDelivered, orderType, sortBy, } = req.query;
    let parsedPageNo = parseInt(pageNo.toString());
    let parsedPageSize = parseInt(pageSize.toString());
    const filters = {};
    if (from)
        filters['startTime'] = { $gte: new Date(from.toString()) };
    if (to) {
        if (filters['startTime'])
            filters['startTime']['$lte'] = new Date(to.toString());
        else
            filters['startTime'] = { $lte: new Date(to.toString()) };
    }
    if (isDelivered) {
        if (isDelivered == 'true')
            filters['isDroppedCompletely'] = true;
        else if (isDelivered == 'false')
            filters['isDroppedCompletely'] = false;
    }
    if (orderType)
        filters['orderType'] = orderType;
    filters['orderStatus'] = types_1.OrderStatus.PROCESSED;
    const successfulOrders = await orders_1.OrderModel.find(filters);
    const topProductsMap = {};
    for (let i = 0; i < successfulOrders.length; i++) {
        for (let j = 0; j < successfulOrders[i].productsBought.length; j++) {
            const product = successfulOrders[i].productsBought[j];
            const productIdStr = product.productId.toString();
            if (topProductsMap[productIdStr]) {
                topProductsMap[productIdStr].quantityBought += product.quantityBought;
                topProductsMap[productIdStr].totalPrice += product.totalPrice;
            }
            else {
                topProductsMap[productIdStr] = {
                    productId: productIdStr,
                    quantityBought: product.quantityBought,
                    totalPrice: product.totalPrice,
                };
            }
        }
    }
    const topProducts = Object.values(topProductsMap);
    topProducts.sort((a, b) => {
        if (sortBy == 'quantitySold')
            return b.quantityBought - a.quantityBought;
        else
            return b.totalPrice - a.totalPrice;
    });
    const populatedTopProducts = await Promise.all(topProducts.map(async (elem) => {
        const product = await products_1.ProductModel.findById(elem.productId).populate('sellerId', {
            address: false,
            accountInfo: false,
            sessions: false,
            productsSold: false,
            products: false,
        });
        return {
            product,
            totalPrice: elem.totalPrice,
            quantitySold: elem.quantityBought,
        };
    }));
    const length = populatedTopProducts.length;
    const paginatedProducts = populatedTopProducts.slice((parsedPageNo - 1) * parsedPageSize, parsedPageNo * parsedPageSize);
    console.log(paginatedProducts);
    const response = new utils_1.Custom_response(true, null, { topProducts: paginatedProducts, totalProducts: length }, 'success', 200, null);
    res.status(response.statusCode).json(response);
});
exports.topProductsList = topProductsList;
