"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductStatus = exports.ProductModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const types_1 = require("../../../types/types");
Object.defineProperty(exports, "ProductStatus", { enumerable: true, get: function () { return types_1.ProductStatus; } });
const server_1 = require("../../../server");
const ProductSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: {
        type: [
            {
                heading: { type: String },
                info: {
                    type: [
                        {
                            descriptionType: {
                                type: String,
                                enum: Object.values(types_1.descriptionType),
                            },
                            value: { type: [String] },
                        },
                    ],
                },
            },
        ],
    },
    price: { type: Number, required: true },
    category: {
        type: String,
        enum: Object.values(types_1.ProductCategory),
        required: true,
    },
    sellerId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'SellerPerma', required: true },
    stock: { type: Number, required: true, min: 0 },
    images: [{ type: String }],
    createdOn: { type: Date, default: Date.now },
    tags: { type: [String], default: [], required: true },
    reviews: {
        type: [
            {
                by: { type: mongoose_1.Schema.Types.ObjectId, ref: 'BuyerPerma' },
                comment: { type: String },
            },
        ],
    },
    ratings: {
        type: [
            {
                by: { type: mongoose_1.Schema.Types.ObjectId, ref: 'BuyerPerma' },
                rating: { type: String },
            },
        ],
    },
    verificationDetails: {
        type: {
            verificationStatus: {
                type: String,
                required: true,
                enum: Object.values(types_1.productVerificationStatus),
            },
            rejectionReason: { type: String },
            verifiedBy: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'AdminPerma',
            },
        },
        default: {
            verificationStatus: types_1.productVerificationStatus.PENDING,
        },
    },
});
ProductSchema.statics.build = function (productAttributes) {
    return new this(productAttributes);
};
ProductSchema.post('findOneAndUpdate', function (result) {
    ProductModel.findById(result._id).then((doc) => {
        if (!doc)
            return;
        if (doc.verificationDetails.verificationStatus !=
            types_1.productVerificationStatus.ACCEPTED)
            return;
        const algoliaRecord = {
            objectID: doc._id,
            name: doc.name,
            description: doc.description,
            price: doc.price,
            category: doc.category,
            stock: doc.stock,
            tags: doc.tags,
            images: doc.images,
            reviews: doc.reviews,
            ratings: doc.ratings,
        };
        server_1.index.saveObject(algoliaRecord).then(() => {
            console.log('Product updated in Algolia:', doc._id);
        });
    });
});
const ProductModel = mongoose_1.default.model('Product', ProductSchema);
exports.ProductModel = ProductModel;
