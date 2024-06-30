import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import { TransactionAttributes } from '../utils/common';
import { TransactionStatus } from '../../../types/types';
export interface TransactionDoc extends Document, TransactionAttributes {
  transactionDate: Date;
}
interface TransactionModel extends Model<TransactionDoc> {
  build(attributes: TransactionAttributes): TransactionDoc;
}
const TransactionSchema = new Schema<TransactionDoc>({
  buyerId: { type: Schema.Types.ObjectId, ref: 'Buyer', required: true },
  databaseOrderId: { type: Schema.Types.ObjectId },
  amount: { type: Number },
  transactionDate: { type: Date, default: Date.now, required: true },
  transactionStatus: {
    type: String,
    enum: Object.values(TransactionStatus),
    required: true,
    default: TransactionStatus.PENDING,
  },
  orderId: { type: String },
  paymentId: { type: String },
  paymentSignature: { type: String },
});

TransactionSchema.statics.build = function (
  transactionAttributes: TransactionAttributes
) {
  return new this(transactionAttributes);
};

const TransactionModel = mongoose.model<TransactionDoc, TransactionModel>(
  'Transaction',
  TransactionSchema
);

export { TransactionModel };
