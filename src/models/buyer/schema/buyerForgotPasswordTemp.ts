import mongoose, { Model, Schema, Document } from 'mongoose';
import { BuyerForgotPasswordAttributesTemp } from '../utils/common';

export function calculateExpiry() {
  const expiresIn = process.env.MAX_PASSWORD_CHANGE_TIME;
  return new Date(
    Date.now() +
      1000 * 60 * parseInt(expiresIn!.substring(0, expiresIn!.length - 1))
  );
}

interface BuyerForgotPasswordTempDoc
  extends Document,
    BuyerForgotPasswordAttributesTemp {
  otpSentTimes: number;
  createdAt: Date;
  expiresAt: Date;
  otpJwt: string;
  isExpired: boolean;
}

interface BuyerForgotPasswordTempModel
  extends Model<BuyerForgotPasswordTempDoc> {
  build(
    attributes: BuyerForgotPasswordAttributesTemp
  ): BuyerForgotPasswordTempDoc;
}

const BuyerForgotPasswordTempSchema = new Schema<BuyerForgotPasswordTempDoc>({
  buyerId: { type: Schema.Types.ObjectId, required: true, unique: true },
  otp: { type: String, required: true },
  otpSentTimes: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: calculateExpiry },
  sendTo: { type: String, required: true },
  otpJwt: { type: String },
  isEmail: { type: Boolean, required: true },
  isExpired: { type: Boolean, required: true, default: false },
  deviceFingerprint: { type: String, required: true },
});

BuyerForgotPasswordTempSchema.statics.build = function (
  buyerForgotPasswordAttributesTemp: BuyerForgotPasswordAttributesTemp
) {
  return new this(buyerForgotPasswordAttributesTemp);
};

const BuyerForgotPasswordTempModel = mongoose.model<
  BuyerForgotPasswordTempDoc,
  BuyerForgotPasswordTempModel
>('BuyerForgotPasswordTemp', BuyerForgotPasswordTempSchema);

export { BuyerForgotPasswordTempModel, BuyerForgotPasswordTempDoc };
