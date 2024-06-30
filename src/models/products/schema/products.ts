import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import {
  ProductCategory,
  ProductStatus,
  descriptionType,
  productVerificationStatus,
} from '../../../types/types';
import { ProductAttributes } from '../utils/common';
import { index } from '../../../server';

export interface ProductDoc extends Document, ProductAttributes {
  createdOn: Date;
  reviews: { by: mongoose.Types.ObjectId; comment: String }[];
  ratings: { by: mongoose.Types.ObjectId; rating: number }[];

  verificationDetails: {
    verificationStatus: string;
    verifiedBy: mongoose.Types.ObjectId;
    rejectionReason: string;
  };
}
interface ProductModel extends Model<ProductDoc> {
  build(attributes: ProductAttributes): ProductDoc;
}
const ProductSchema = new Schema<ProductDoc>({
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
                enum: Object.values(descriptionType),
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
    enum: Object.values(ProductCategory),
    required: true,
  },
  sellerId: { type: Schema.Types.ObjectId, ref: 'SellerPerma', required: true },
  stock: { type: Number, required: true, min: 0 },
  images: [{ type: String }],
  createdOn: { type: Date, default: Date.now },
  tags: { type: [String], default: [], required: true },
  reviews: {
    type: [
      {
        by: { type: Schema.Types.ObjectId, ref: 'BuyerPerma' },
        comment: { type: String },
      },
    ],
  },
  ratings: {
    type: [
      {
        by: { type: Schema.Types.ObjectId, ref: 'BuyerPerma' },
        rating: { type: String },
      },
    ],
  },
  verificationDetails: {
    type: {
      verificationStatus: {
        type: String,
        required: true,
        enum: Object.values(productVerificationStatus),
      },
      rejectionReason: { type: String },
      verifiedBy: {
        type: Schema.Types.ObjectId,
        ref: 'AdminPerma',
      },
    },
    default: {
      verificationStatus: productVerificationStatus.PENDING,
    },
  },
});
ProductSchema.statics.build = function (productAttributes: ProductAttributes) {
  return new this(productAttributes);
};
ProductSchema.post('findOneAndUpdate', function (result) {
  ProductModel.findById(result._id).then((doc) => {
    if (!doc) return;
    if (
      doc.verificationDetails.verificationStatus !=
      productVerificationStatus.ACCEPTED
    )
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
    index.saveObject(algoliaRecord).then(() => {
      console.log('Product updated in Algolia:', doc._id);
    });
  });
});
const ProductModel = mongoose.model<ProductDoc, ProductModel>(
  'Product',
  ProductSchema
);

export { ProductModel, ProductAttributes, ProductStatus };
