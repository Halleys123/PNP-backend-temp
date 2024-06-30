import mongoose from 'mongoose';
import { accountType } from '../../../types/types';

interface BankAccount {
  accountNumber: string;
  ifscCode: string;
  accountHolderName: string;
  bankName: string;
  branchName: string;
}
export interface SellerAttributes {
  password: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: {
    houseNumber: string;
    street: string;
    city: string;
    pincode: string;
  };
  accountInfo: {
    accountType: accountType;
    shopName?: string;
    outlet?: string;
    GSTIN?: string;
    businessRegistrationNumber?: string;
  };
  bankAccount: BankAccount;
}
export interface SellerAttributesTemp extends SellerAttributes {
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
  otpJwt: String;
}
export interface SellerForgotPasswordAttributesTemp {
  sellerId: mongoose.Types.ObjectId;
  otp: string;
  sendTo: string;
  isEmail: boolean;
  deviceFingerprint: string;
}
