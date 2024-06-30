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
exports.addProduct = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const products_1 = require("../../../../models/products/schema/products");
const sellerPerma_1 = require("../../../../models/seller/schema/sellerPerma");
const startSocket_1 = require("../../../../startSocket");
const adminPerma_1 = require("../../../../models/admin/schema/adminPerma");
const addProduct = (0, utils_1.async_error_handler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description = '', price, category, stock = 1, images = [], tags, } = req.body;
    const product = products_1.ProductModel.build({
        name,
        description,
        price,
        category,
        tags,
        sellerId: req.seller._id,
        stock,
        images,
    });
    // imageProcessorFunction(images, product._id as Schema.Types.ObjectId);
    yield product.save();
    yield sellerPerma_1.SellerModelPerma.findByIdAndUpdate(req.seller._id, {
        $push: { products: product._id },
    });
    const admins = yield adminPerma_1.AdminModelPerma.find({}, { _id: true });
    admins.forEach((elem) => {
        if (global.connectedUsers.get(elem._id.toString()) != undefined)
            startSocket_1.io.to(global.connectedUsers.get(elem._id.toString())).emit('newProductArrived');
    });
    console.log('vdhj');
    const response = new utils_1.Custom_response(true, null, 'productLodgedSuccessfully', 'success', 200, null);
    res.status(response.statusCode).json(response);
}));
exports.addProduct = addProduct;
