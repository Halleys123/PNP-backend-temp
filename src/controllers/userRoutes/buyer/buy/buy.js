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
exports.buy = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const types_1 = require("../../../../types/types");
const products_1 = require("../../../../models/products/schema/products");
const buyerPerma_1 = require("../../../../models/buyer/schema/buyerPerma");
const orders_1 = require("../../../../models/orders/schema/orders");
const sellerPerma_1 = require("../../../../models/seller/schema/sellerPerma");
const buy = (0, utils_1.async_error_handler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { cart, addressIndex } = req.body;
    console.log(req.body);
    if (addressIndex == undefined || addressIndex == null) {
        throw new utils_1.Custom_error({
            errors: [{ message: 'sendTheAddressIndex' }],
            statusCode: 400,
        });
    }
    const address = req.buyer.address[addressIndex];
    if (!address) {
        throw new utils_1.Custom_error({
            errors: [{ message: 'noSuchAddress' }],
            statusCode: 400,
        });
    }
    if (!cart || !cart.length) {
        throw new utils_1.Custom_error({
            errors: [{ message: 'sendTheProducts' }],
            statusCode: 400,
        });
    }
    const productsFromDatabase = [];
    const finalProductArray = [];
    let totalPrice = 0;
    const productsBought = [];
    const productsBoughtWithCost = [];
    for (const elem of cart) {
        const product = yield products_1.ProductModel.findById(elem.productId);
        if (!product) {
            throw new utils_1.Custom_error({
                errors: [{ message: 'noSuchProduct' }],
                statusCode: 404,
            });
        }
        if (product.stock === 0)
            continue;
        productsFromDatabase.push(product);
        const quantity = elem.quantity
            ? Math.min(elem.quantity, product.stock)
            : 1;
        finalProductArray.push({ productId: elem.productId, quantity });
        totalPrice += product.price * quantity;
        productsBought.push({
            productId: elem.productId,
            isDropped: false,
            quantityBought: quantity,
            totalPrice: product.price * quantity,
        });
        productsBoughtWithCost.push({
            productId: elem.productId,
            quantityBought: quantity,
            cost: product.price * quantity,
        });
        yield products_1.ProductModel.findByIdAndUpdate(elem.productId, {
            $set: { stock: product.stock - quantity },
        });
    }
    const order = orders_1.OrderModel.build({
        placedBy: req.buyer._id,
        isCompletelyDropped: false,
        isSorted: false,
        productsBought,
        dropAddress: address,
        amount: totalPrice,
    });
    yield order.save();
    const sellerUpdates = productsFromDatabase.map((product, i) => {
        return sellerPerma_1.SellerModelPerma.findByIdAndUpdate(product.sellerId, {
            $push: {
                productsSold: {
                    productId: finalProductArray[i].productId,
                    quantitySold: finalProductArray[i].quantity,
                    orderId: order._id,
                    totalPrice: finalProductArray[i].quantity * product.price,
                },
            },
        });
    });
    yield Promise.all(sellerUpdates);
    const orderJwt = yield (0, utils_1.createJwt)({
        payload: { _id: order._id },
        options: { expiresIn: process.env.MAX_TRANSACTION_TIME },
    }, process.env.TRANSACTION_TOKEN_SECRET);
    yield buyerPerma_1.BuyerModelPerma.findByIdAndUpdate(req.buyer._id, {
        $push: { transactions: { orderId: order._id } },
    });
    const expiresIn = process.env.MAX_TRANSACTION_TIME;
    setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
        const myOrder = yield orders_1.OrderModel.findById(order._id);
        console.log(myOrder);
        if ((myOrder === null || myOrder === void 0 ? void 0 : myOrder.orderStatus) == types_1.OrderStatus.PENDING) {
            yield orders_1.OrderModel.findByIdAndUpdate(myOrder._id, {
                $set: { orderStatus: types_1.OrderStatus.FAILED },
            });
            const productUpdates = myOrder.productsBought.map((_a) => __awaiter(void 0, [_a], void 0, function* ({ productId, quantityBought }) {
                const product = yield products_1.ProductModel.findById(productId);
                yield products_1.ProductModel.findByIdAndUpdate(productId, {
                    $set: { stock: quantityBought + ((product === null || product === void 0 ? void 0 : product.stock) || 0) },
                });
            }));
            yield Promise.all(productUpdates);
        }
    }), 1000 * 60 * parseInt(expiresIn.substring(0, expiresIn.length - 1)));
    const response = new utils_1.Custom_response(true, null, { orderToken: orderJwt, totalPrice, productsBoughtWithCost }, 'success', 200, null);
    res.status(response.statusCode).json(response);
}));
exports.buy = buy;
