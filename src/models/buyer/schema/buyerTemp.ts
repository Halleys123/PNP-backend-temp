import mongoose, { Schema, Document, Model } from 'mongoose';
import { BuyerAttributesTemp } from '../utils/common';
export function calculateExpiry() {
  const expiresIn = process.env.SIGNUP_OTP_TIME;
  return new Date(
    Date.now() +
      1000 * 60 * parseInt(expiresIn!.substring(0, expiresIn!.length - 1))
  );
}

interface BuyerDoc extends Document, BuyerAttributesTemp {
  createdOn: Date;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  otpSentTimes: number;
}

interface BuyerModel extends Model<BuyerDoc> {
  build(attributes: BuyerAttributesTemp): BuyerDoc;
}

const BuyerSchema = new Schema<BuyerDoc>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  phoneOtp: {
    otp: { type: String, required: true },
    isVerified: { type: Boolean, required: true, default: false },
    isExpired: { type: Boolean, required: true, default: false },
    createdAt: { type: Date, required: true, default: Date.now },
    expiresAt: { type: Date, required: true, default: calculateExpiry },
    otpSentTimes: { type: Number, required: true, default: 0 },
  },
  emailOtp: {
    otp: { type: String, required: true },
    isVerified: { type: Boolean, required: true, default: true },
    isExpired: { type: Boolean, required: true, default: false },
    createdAt: { type: Date, required: true, default: Date.now },
    expiresAt: { type: Date, required: true, default: calculateExpiry },
    otpSentTimes: { type: Number, required: true, default: 0 },
  },
  deviceFingerprint: { type: String, required: true },
  otpJwt: { type: String, required: true },
});

BuyerSchema.statics.build = function (buyerAttributes: BuyerAttributesTemp) {
  return new this(buyerAttributes);
};

const BuyerModel = mongoose.model<BuyerDoc, BuyerModel>(
  'BuyerTemp',
  BuyerSchema
);
export { BuyerModel as BuyerModelTemp, BuyerDoc as BuyerDocTemp };
