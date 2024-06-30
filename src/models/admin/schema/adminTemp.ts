import { Document, Model, Schema } from 'mongoose';
import { AdminTempAttributes, AdminType } from '../utils/common';
import mongoose from 'mongoose';
export function calculateExpiry() {
  const expiresIn = process.env.SIGNUP_OTP_TIME;
  return new Date(
    Date.now() +
      1000 * 60 * parseInt(expiresIn!.substring(0, expiresIn!.length - 1))
  );
}

interface AdminTempDoc extends Document, AdminTempAttributes {
  otpSentTimes: number;
  createdAt: Date;
  expiresAt: Date;
  otpJwt: string;
  isExpired: boolean;
}

interface AdminTempModel extends Model<AdminTempDoc> {
  build(attributes: AdminTempAttributes): AdminTempDoc;
}
const AdminTempSchema = new Schema<AdminTempDoc>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  designation: { type: String, enum: Object.values(AdminType), required: true },
  phoneNumber: {
    type: String,
    required: true,
  },
  otpSentTimes: {
    type: Number,
    required: true,
    default: 1,
  },
  otp: { type: String },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    default: calculateExpiry,
  },
  deviceFingerprint: {
    type: String,
    required: true,
  },
  otpJwt: { type: String },
  password: { type: String, required: true },
});
AdminTempSchema.statics.build = function (
  adminAttributes: AdminTempAttributes
) {
  return new this(adminAttributes);
};
const AdminModelTemp = mongoose.model<AdminTempDoc, AdminTempModel>(
  'AdminTemp',
  AdminTempSchema
);
export { AdminModelTemp, AdminTempDoc };
