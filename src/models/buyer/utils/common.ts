import mongoose from 'mongoose';

export interface BuyerAttributes {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
}

export interface BuyerAttributesTemp extends BuyerAttributes {
  phoneOtp: {
    otp: string;
    isVerified?: boolean;
    isExpired?: boolean;
    createdAt?: Date;
    expiresAt?: Date;
    otpSentTimes?: number;
  };
  emailOtp: {
    otp: string;
    isVerified?: boolean;
    isExpired?: boolean;
    createdAt?: Date;
    expiresAt?: Date;
    otpSentTimes?: number;
  };
  deviceFingerprint: string;
  otpJwt: string;
}
export interface BuyerForgotPasswordAttributesTemp {
  buyerId: mongoose.Types.ObjectId;
  otp: string;
  sendTo: string;
  isEmail: boolean;
  deviceFingerprint: string;
}
