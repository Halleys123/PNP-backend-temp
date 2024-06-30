import { Document, Model, Schema } from 'mongoose';
import { AdminPermaAttributes, AdminType } from '../utils/common';
import mongoose from 'mongoose';

interface AdminPermaDoc extends Document, AdminPermaAttributes {
  isVerifiedByMainAdmin: Boolean;
  sessions: mongoose.Types.ObjectId[];
}

interface AdminPermaModel extends Model<AdminPermaDoc> {
  build(attributes: AdminPermaAttributes): AdminPermaDoc;
}
const AdminPermaSchema = new Schema<AdminPermaDoc>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  designation: { type: String, enum: Object.values(AdminType) },
  password: { type: String, required: true, select: false },
  phoneNumber: {
    type: String,
    required: true,
  },
  isVerifiedByMainAdmin: {
    type: Boolean,
    default: false,
    required: true,
  },
  sessions: { type: [Schema.Types.ObjectId], ref: 'Session' },
});
AdminPermaSchema.statics.build = function (
  adminAttributes: AdminPermaAttributes
) {
  return new this(adminAttributes);
};
const AdminModelPerma = mongoose.model<AdminPermaDoc, AdminPermaModel>(
  'AdminPerma',
  AdminPermaSchema
);
export { AdminModelPerma, AdminPermaDoc };
