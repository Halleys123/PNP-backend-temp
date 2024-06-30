import mongoose, { Schema, Document, Model } from 'mongoose';
import { accountType } from '../../../types/types';
import { SellerAttributesTemp } from '../utils/common';

export function calculateExpiry() {
  const expiresIn = process.env.SIGNUP_OTP_TIME;
  return new Date(
    Date.now() +
      1000 * 60 * parseInt(expiresIn!.substring(0, expiresIn!.length - 1))
  );
}
interface SellerDoc extends Document, SellerAttributesTemp {}
interface SellerModel extends Model<SellerDoc> {
  build(attributes: SellerAttributesTemp): SellerDoc;
}
const SellerSchema = new Schema<SellerDoc>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
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
    businessRegistrationNumber: { type: String, unique: true },
  },
  bankAccount: {
    accountNumber: { type: String, required: true },
    ifscCode: { type: String, required: true },
    accountHolderName: { type: String, required: true },
    bankName: { type: String, required: true },
    branchName: { type: String, required: true },
  },
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

SellerSchema.statics.build = function (
  sellerAttributesTemp: SellerAttributesTemp
) {
  return new this(sellerAttributesTemp);
};

const SellerModel = mongoose.model<SellerDoc, SellerModel>(
  'SellerTemp',
  SellerSchema
);

export { SellerModel as SellerModelTemp, SellerDoc as SellerDocTemp };
