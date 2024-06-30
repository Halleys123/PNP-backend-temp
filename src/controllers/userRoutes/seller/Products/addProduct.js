"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addProduct = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const products_1 = require("../../../../models/products/schema/products");
const sellerPerma_1 = require("../../../../models/seller/schema/sellerPerma");
const startSocket_1 = require("../../../../startSocket");
const adminPerma_1 = require("../../../../models/admin/schema/adminPerma");
const addProduct = (0, utils_1.async_error_handler)(async (req, res, next) => {
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
    await product.save();
    await sellerPerma_1.SellerModelPerma.findByIdAndUpdate(req.seller._id, {
        $push: { products: product._id },
    });
    const admins = await adminPerma_1.AdminModelPerma.find({}, { _id: true });
    admins.forEach((elem) => {
        if (global.connectedUsers.get(elem._id.toString()) != undefined)
            startSocket_1.io.to(global.connectedUsers.get(elem._id.toString())).emit('newProductArrived');
    });
    console.log('vdhj');
    const response = new utils_1.Custom_response(true, null, 'productLodgedSuccessfully', 'success', 200, null);
    res.status(response.statusCode).json(response);
});
exports.addProduct = addProduct;
