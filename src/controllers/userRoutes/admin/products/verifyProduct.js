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
exports.verifyProduct = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const products_1 = require("../../../../models/products/schema/products");
const types_1 = require("../../../../types/types");
const adminPerma_1 = require("../../../../models/admin/schema/adminPerma");
const startSocket_1 = require("../../../../startSocket");
const verifyProduct = (0, utils_1.async_error_handler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { productToBeVerified, tags, verificationStatus, rejectionReason } = req.body;
    if (!productToBeVerified)
        throw new utils_1.Custom_error({
            errors: [{ message: 'sendAProduct' }],
            statusCode: 400,
        });
    if (typeof verificationStatus != 'string')
        throw new utils_1.Custom_error({
            errors: [{ message: 'toVerifyFieldMustBeABoolean' }],
            statusCode: 400,
        });
    const product = yield products_1.ProductModel.findById(productToBeVerified);
    if ((product === null || product === void 0 ? void 0 : product.verificationDetails.verificationStatus) !=
        types_1.productVerificationStatus.PENDING)
        throw new utils_1.Custom_error({
            errors: [{ message: 'theProductVerificationIsNotPending' }],
            statusCode: 400,
        });
    if (!product)
        throw new utils_1.Custom_error({
            errors: [{ message: 'noSuchProduct' }],
            statusCode: 400,
        });
    if (!tags) {
        tags = product.tags;
    }
    if (!rejectionReason)
        rejectionReason = '';
    yield products_1.ProductModel.findByIdAndUpdate(productToBeVerified, {
        $set: {
            'verificationDetails.verifiedBy': req.admin._id,
            'verificationDetails.verificationStatus': verificationStatus,
            'verificationDetails.rejectionReason': rejectionReason,
        },
    });
    const admins = yield adminPerma_1.AdminModelPerma.find({}, { _id: true });
    admins.forEach((elem) => {
        if (global.connectedUsers.get(elem._id.toString()) != undefined)
            startSocket_1.io.to(global.connectedUsers.get(elem._id.toString())).emit('newProductArrived');
    });
    const response = new utils_1.Custom_response(true, null, 'veificationDone', 'success', 200, null);
    res.status(response.statusCode).json(response);
}));
exports.verifyProduct = verifyProduct;
