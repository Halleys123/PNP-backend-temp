import mongoose, { Schema } from 'mongoose';
import { ProductStatus } from '../../../types/types';
export interface OrderAttributes {
  placedBy: mongoose.Types.ObjectId;
  isSorted: Boolean;
  isCompletelyDropped: boolean;
  productsBought: {
    isDropped: boolean;
    productId: mongoose.Types.ObjectId;
    quantityBought: number;
    totalPrice: number;
  }[];
  dropAddress: {
    houseNumber: string;
    street: string;
    city: string;
    pincode: string;
  };
  amount: number;
}
