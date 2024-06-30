import mongoose, { Model, Schema, Document } from 'mongoose';
import { SellerForgotPasswordAttributesTemp } from '../utils/common';

export function calculateExpiry() {
  const expiresIn = process.env.MAX_PASSWORD_CHANGE_TIME;
  return new Date(
    Date.now() +
      1000 * 60 * parseInt(expiresIn!.substring(0, expiresIn!.length - 1))
  );
}

interface SellerForgotPasswordTempDoc
  extends Document,
    SellerForgotPasswordAttributesTemp {
  otpSentTimes: number;
  createdAt: Date;
  expiresAt: Date;
  otpJwt: string;
  isExpired: boolean;
}

interface SellerForgotPasswordTempModel
  extends Model<SellerForgotPasswordTempDoc> {
  build(
    attributes: SellerForgotPasswordAttributesTemp
  ): SellerForgotPasswordTempDoc;
}

const SellerForgotPasswordTempSchema = new Schema<SellerForgotPasswordTempDoc>({
  sellerId: { type: Schema.Types.ObjectId, required: true, unique: true },
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

SellerForgotPasswordTempSchema.statics.build = function (
  sellerForgotPasswordAttributesTemp: SellerForgotPasswordAttributesTemp
) {
  return new this(sellerForgotPasswordAttributesTemp);
};

const SellerForgotPasswordTempModel = mongoose.model<
  SellerForgotPasswordTempDoc,
  SellerForgotPasswordTempModel
>('SellerForgotPasswordTemp', SellerForgotPasswordTempSchema);

export { SellerForgotPasswordTempModel, SellerForgotPasswordTempDoc };
