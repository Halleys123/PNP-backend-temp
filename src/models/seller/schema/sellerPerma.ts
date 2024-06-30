import mongoose, { Schema, Document, Model } from 'mongoose';
import { accountType } from '../../../types/types';
import { SellerAttributes } from '../utils/common';
interface SellerDoc extends Document, SellerAttributes {
  createdOn: Date;
  products: mongoose.Types.ObjectId[];
  sessions: mongoose.Types.ObjectId[];
  productsSold: {
    productId: mongoose.Types.ObjectId;
    quantitySold: number;
    totalPrice: number;
    orderId: mongoose.Types.ObjectId;
  }[];
}
interface SellerModel extends Model<SellerDoc> {
  build(attributes: SellerAttributes): SellerDoc;
}
const SellerSchema = new Schema<SellerDoc>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: {
    select: false,
    type: String,
    required: true,
  },
  phoneNumber: { type: String, required: true, unique: true },
  address: {
    houseNumber: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  accountInfo: {
    accountType: {
      type: String,
      enum: Object.values(accountType),
      required: true,
    },
    GSTIN: { type: String },
    outlet: { type: String },
    shopName: { type: String },
    businessRegistrationNumber: { type: String },
  },
  bankAccount: {
    accountNumber: { type: String, required: true, select: false },
    ifscCode: { type: String, required: true, select: false },
    accountHolderName: { type: String, required: true, select: false },
    bankName: { type: String, required: true, select: false },
    branchName: { type: String, required: true, select: false },
  },
  createdOn: { type: Date, default: Date.now },
  products: {
    type: [Schema.Types.ObjectId],
    ref: 'Product',
  },
  productsSold: {
    type: [
      {
        type: {
          productId: { type: Schema.Types.ObjectId, ref: 'Product' },
          quantitySold: { type: Number },
          orderId: {
            type: Schema.Types.ObjectId,
            ref: 'Order',
          },
          totalPrice: { type: Number },
        },
      },
    ],
  },
  sessions: { type: [Schema.Types.ObjectId], ref: 'Session' },
});
SellerSchema.statics.build = function (sellerAttributes: SellerAttributes) {
  return new this(sellerAttributes);
};

const SellerModel = mongoose.model<SellerDoc, SellerModel>(
  'SellerPerma',
  SellerSchema
);
export { SellerModel as SellerModelPerma, SellerDoc as SellerDocPerma };
