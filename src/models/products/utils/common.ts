import { Types } from 'mongoose';
import {
  ProductCategory,
  ProductStatus,
  descriptionType,
} from '../../../types/types';

export interface ProductAttributes {
  name: string;
  description: {
    heading: string;
    info: { descriptionType: descriptionType; value: string[] }[];
  }[];
  price: number;
  category: ProductCategory;
  sellerId: Types.ObjectId;
  stock: number;
  tags: string[];
  images: string[];
}
