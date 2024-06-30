import mongoose, { Model, Schema, Document } from 'mongoose';
import { OrderAttributes } from '../utils/common';
import { DeliveryStatus, OrderStatus, OrderType } from '../../../types/types';

export interface OrderDoc extends Document, OrderAttributes {
  transactionId: mongoose.Types.ObjectId;
  orderType: OrderType;
  startTime: Date;
  expireTime: Date;
  orderStatus: OrderStatus;
  deliveryStatus: DeliveryStatus;
  delivery: {
    trackingId: string;
    orderId: string;
  };
}
export function calculateExpiry() {
  const expiresIn = process.env.MAX_TRANSACTION_TIME;
  return new Date(
    Date.now() +
      1000 * 60 * parseInt(expiresIn!.substring(0, expiresIn!.length - 1))
  );
}
interface OrderModel extends Model<OrderDoc> {
  build(attributes: OrderAttributes): OrderDoc;
}

const OrderSchema = new Schema<OrderDoc>({
  placedBy: { type: Schema.Types.ObjectId, ref: 'BuyerPerma', required: true },
  isCompletelyDropped: { type: Boolean, required: true, default: false },
  orderStatus: {
    type: String,
    enum: Object.values(OrderStatus),
    default: OrderStatus.PENDING,
  },
  productsBought: [
    {
      isDropped: { type: Boolean, required: true, default: false },
      productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantityBought: { type: Number },
      totalPrice: { type: Number },
    },
  ],
  delivery: {
    type: {
      trackingId: {
        type: String,
      },
      orderId: {
        type: String,
      },
    },
  },
  deliveryStatus: {
    type: String,
    default: DeliveryStatus.NOT_INITIATED,
    enum: Object.values(DeliveryStatus),
    required: true,
  },
  isSorted: { type: Boolean },
  orderType: { type: String, enum: Object.values(OrderType) },
  transactionId: { type: Schema.Types.ObjectId, ref: 'Transaction' },
  startTime: { type: Date, required: true, default: Date.now },
  expireTime: { type: Date, required: true, default: calculateExpiry },
  amount: { type: Number, required: true },
  dropAddress: {
    houseNumber: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
  },
});

OrderSchema.statics.build = function (orderAttributes: OrderAttributes) {
  return new this(orderAttributes);
};

const OrderModel = mongoose.model<OrderDoc, OrderModel>('Order', OrderSchema);

export { OrderModel };
