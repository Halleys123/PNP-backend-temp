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
exports.topSellersList = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const orders_1 = require("../../../../models/orders/schema/orders");
const types_1 = require("../../../../types/types");
const products_1 = require("../../../../models/products/schema/products");
const sellerPerma_1 = require("../../../../models/seller/schema/sellerPerma");
const topSellersList = (0, utils_1.async_error_handler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
    const successfulOrders = yield orders_1.OrderModel.find(filters);
    const topProductsMap = {};
    for (let i = 0; i < successfulOrders.length; i++) {
        for (let j = 0; j < successfulOrders[i].productsBought.length; j++) {
            const product = successfulOrders[i].productsBought[j];
            if (topProductsMap[product.productId.toString()]) {
                topProductsMap[product.productId.toString()].quantityBought +=
                    product.quantityBought;
                topProductsMap[product.productId.toString()].totalPrice +=
                    product.totalPrice;
            }
            else {
                topProductsMap[product.productId.toString()] = {
                    productId: product.productId.toString(),
                    quantityBought: product.quantityBought,
                    totalPrice: product.totalPrice,
                };
            }
        }
    }
    const topProducts = Object.values(topProductsMap);
    let topSellersMap = {};
    for (let i = 0; i < topProducts.length; i++) {
        const product = yield products_1.ProductModel.findById(topProducts[i].productId);
        const sellerIdStr = product.sellerId.toString();
        if (topSellersMap[sellerIdStr]) {
            const sellerData = topSellersMap[sellerIdStr];
            sellerData.productIds.push(product._id.toString());
            sellerData.quantitySold.push(topProducts[i].quantityBought);
            sellerData.totalPrice.push(topProducts[i].totalPrice);
            sellerData.netRevenue += topProducts[i].totalPrice;
            sellerData.netProductsSold += topProducts[i].quantityBought;
        }
        else {
            topSellersMap[sellerIdStr] = {
                sellerId: sellerIdStr,
                productIds: [product._id.toString()],
                quantitySold: [topProducts[i].quantityBought],
                totalPrice: [topProducts[i].totalPrice],
                netRevenue: topProducts[i].totalPrice,
                netProductsSold: topProducts[i].quantityBought,
            };
        }
    }
    const topSellers = Object.values(topSellersMap);
    topSellers.sort((a, b) => {
        if (sortBy == 'netProductsSold')
            return b.netProductsSold - a.netProductsSold;
        else
            return b.netRevenue - a.netRevenue;
    });
    const topSellersInfo = topSellers.map((elem) => __awaiter(void 0, void 0, void 0, function* () {
        const seller = yield sellerPerma_1.SellerModelPerma.findById(elem.sellerId, {
            name: true,
            email: true,
            phoneNumber: true,
        });
        return {
            seller,
            netProductsSold: elem.netProductsSold,
            quantitySold: elem.quantitySold,
            productIds: elem.productIds,
            totalPriceOfEachProduct: elem.totalPrice,
            netRevenue: elem.netRevenue,
        };
    }));
    const length = topSellersList.length;
    const paginatedTopSellers = (yield Promise.all(topSellersInfo)).slice((parsedPageNo - 1) * parsedPageSize, parsedPageNo * parsedPageSize);
    const response = new utils_1.Custom_response(true, null, { topSellers: paginatedTopSellers, totalSellers: length }, 'success', 200, null);
    res.status(response.statusCode).json(response);
}));
exports.topSellersList = topSellersList;
