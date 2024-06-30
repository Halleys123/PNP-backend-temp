import mongoose from 'mongoose';

export interface AdminAttributes {
  name: string;
  email: string;
  designation: string;
  phoneNumber: string;
  password: string;
}
export interface AdminTempAttributes extends AdminAttributes {
  deviceFingerprint: string;
  otp: string;
}
export interface AdminPermaAttributes extends AdminAttributes {}
export interface AdminForgotPasswordAttributesTemp {
  adminId: mongoose.Types.ObjectId;
  otp: string;
  sendTo: string;
  isEmail: boolean;
  deviceFingerprint: string;
}

export enum AdminType {
  MAIN_ADMIN = 'mainAdmin',
  SUB_ADMIN = 'subAdmin',
}
