import { Types } from 'mongoose';
import { TransactionStatus } from '../../../types/types';

export interface TransactionAttributes {
  buyerId: Types.ObjectId;
  amount: number;
  transactionStatus: TransactionStatus;
  orderId: string;
  paymentId: string;
  paymentSignature: string;
  databaseOrderId: Types.ObjectId;
}
