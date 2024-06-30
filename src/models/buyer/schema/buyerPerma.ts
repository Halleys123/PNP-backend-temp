import mongoose, { Schema, Document, Model } from 'mongoose';
import { BuyerAttributes } from '../utils/common';
import { ProductStatus } from '../../../types/types';

interface BuyerDoc extends Document, BuyerAttributes {
  createdOn: Date;
  address: {
    houseNumber: string;
    street: string;
    city: string;
    pincode: string;
  }[];
  transactions: {
    transactionId: mongoose.Types.ObjectId;
    orderId: mongoose.Types.ObjectId;
  }[];

  sessions: mongoose.Types.ObjectId[];
  cart: { productId: mongoose.Types.ObjectId; quantity: number }[];
}
interface BuyerModel extends Model<BuyerDoc> {
  build(attributes: BuyerAttributes): BuyerDoc;
}
const BuyerSchema = new Schema<BuyerDoc>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  phoneNumber: { type: String, required: true, unique: true },
  createdOn: { type: Date, required: true, default: Date.now },
  address: [
    {
      houseNumber: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      pincode: { type: String, required: true },
    },
  ],
  transactions: {
    type: [
      {
        transactionId: { type: Schema.Types.ObjectId, ref: 'Transaction' },
        orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
      },
    ],
  },
  sessions: { type: [Schema.Types.ObjectId], ref: 'Session' },
  cart: {
    type: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number },
      },
    ],
  },
});

BuyerSchema.statics.build = function (buyerAttributes: BuyerAttributes) {
  return new this(buyerAttributes);
};

const BuyerModel = mongoose.model<BuyerDoc, BuyerModel>(
  'BuyerPerma',
  BuyerSchema
);

export { BuyerModel as BuyerModelPerma, BuyerDoc as BuyerDocPerma };
