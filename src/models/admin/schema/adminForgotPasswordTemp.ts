import mongoose, { Model, Schema, Document } from 'mongoose';
import { AdminForgotPasswordAttributesTemp } from '../utils/common';

export function calculateExpiry() {
  const expiresIn = process.env.MAX_PASSWORD_CHANGE_TIME;
  return new Date(
    Date.now() +
      1000 * 60 * parseInt(expiresIn!.substring(0, expiresIn!.length - 1))
  );
}

interface AdminForgotPasswordTempDoc
  extends Document,
    AdminForgotPasswordAttributesTemp {
  otpSentTimes: number;
  createdAt: Date;
  expiresAt: Date;
  otpJwt: string;
  isExpired: boolean;
}

interface AdminForgotPasswordTempModel
  extends Model<AdminForgotPasswordTempDoc> {
  build(
    attributes: AdminForgotPasswordAttributesTemp
  ): AdminForgotPasswordTempDoc;
}

const AdminForgotPasswordTempSchema = new Schema<AdminForgotPasswordTempDoc>({
  adminId: { type: Schema.Types.ObjectId, required: true, unique: true },
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

AdminForgotPasswordTempSchema.statics.build = function (
  adminForgotPasswordAttributesTemp: AdminForgotPasswordAttributesTemp
) {
  return new this(adminForgotPasswordAttributesTemp);
};

const AdminForgotPasswordTempModel = mongoose.model<
  AdminForgotPasswordTempDoc,
  AdminForgotPasswordTempModel
>('AdminForgotPasswordTemp', AdminForgotPasswordTempSchema);

export { AdminForgotPasswordTempModel, AdminForgotPasswordTempDoc };
