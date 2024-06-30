import { Request } from 'express';
import { SellerDocTemp } from '../models/seller/schema/sellerTemp';
import { SellerDocPerma } from '../models/seller/schema/sellerPerma';
import { SessionDoc } from '../models/sessions/schema/sesssions';
import { BuyerDocTemp } from '../models/buyer/schema/buyerTemp';
import { BuyerDocPerma } from '../models/buyer/schema/buyerPerma';
import { TransactionDoc } from '../models/transactions/schema/schema';
import { OrderDoc } from '../models/orders/schema/orders';
import { BuyerForgotPasswordTempDoc } from '../models/buyer/schema/buyerForgotPasswordTemp';
import { SellerForgotPasswordTempDoc } from '../models/seller/schema/sellerForgotPasswordTemp';
import { AdminTempDoc } from '../models/admin/schema/adminTemp';
import { AdminPermaDoc } from '../models/admin/schema/adminPerma';
import { AdminForgotPasswordTempDoc } from '../models/admin/schema/adminForgotPasswordTemp';

export enum ProductStatus {
  SOLD = 'sold',
  SELLING_IN_PROCESS = 'sellingInProcess',
  NOT_SOLD = 'notSold',
}
export enum ProductCategory {
  PLANT = 'plant',
  POT = 'pot',
}
export enum accountType {
  INDIVIDUAL = 'individual',
  BUSINESS = 'business',
}
export enum OrderStatus {
  PROCESSED = 'processed',
  PENDING = 'pending',
  FAILED = 'failed',
}
export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum roles {
  BUYER = 'buyer',
  SELLER = 'seller',
  ADMIN = 'admin',
}
export enum OrderType {
  ONLINE_PAYMENT = 'onlinePayment',
  CASH_ON_DELIVERY = 'cashOnDelivery',
}
export interface requestWithDeviceFingerprint extends Request {
  device?: {
    deviceFingerprint?: string;
    operatingSystem?: string;
    hashedDeviceFingerprint?: string;
  };
}
export interface requestWithTempSeller extends requestWithDeviceFingerprint {
  seller?: SellerDocTemp;
}
export interface requestWithPermaSeller extends requestWithDeviceFingerprint {
  seller?: SellerDocPerma;
}
export interface requestWithPermaSellerAndSession
  extends requestWithPermaSeller {
  session?: SessionDoc;
}
export interface requestWithDeviceFingerprint extends Request {
  device?: {
    deviceFingerprint?: string;
    operatingSystem?: string;
    hashedDeviceFingerprint?: string;
  };
}
export interface requestWithTempBuyer extends requestWithDeviceFingerprint {
  buyer?: BuyerDocTemp;
}
export interface requestWithPermaBuyer extends requestWithDeviceFingerprint {
  buyer?: BuyerDocPerma;
}
export interface requestWithPermaBuyerAndSession extends requestWithPermaBuyer {
  session?: SessionDoc;
}
export interface requestWithTransaction extends requestWithPermaBuyer {
  transaction?: TransactionDoc;
}
export interface requestWithOrder extends requestWithPermaBuyer {
  order?: OrderDoc;
}
export interface requestWithForgotPasswordBuyer extends requestWithPermaBuyer {
  forgotPasswordBuyer?: BuyerForgotPasswordTempDoc;
}
export enum descriptionType {
  DESCRIPTION = 'description',
  BULLET = 'points',
}
export interface requestWithForgotPasswordSeller
  extends requestWithPermaSeller {
  forgotPasswordSeller?: SellerForgotPasswordTempDoc;
}
export interface requestWithTempAdmin extends requestWithDeviceFingerprint {
  admin?: AdminTempDoc;
}
export interface requestWithPermaAdmin extends requestWithDeviceFingerprint {
  admin?: AdminPermaDoc;
}
export interface requestWithPermaAdminAndSession extends requestWithPermaAdmin {
  session?: SessionDoc;
}
export enum productVerificationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}
export interface requestWithForgotPasswordAdmin extends requestWithPermaAdmin {
  forgotPasswordAdmin?: AdminForgotPasswordTempDoc;
}
export enum DeliveryStatus {
  ON_THE_GO = 'onTheGo',
  NOT_INITIATED = 'notInitiated',
  DELIVERED = 'delivered',
}
