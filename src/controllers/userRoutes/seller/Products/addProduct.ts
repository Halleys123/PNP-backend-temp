import {
  Custom_response,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { requestWithPermaSeller } from '../../../../types/types';
import { ProductModel } from '../../../../models/products/schema/products';
import mongoose, { Mongoose, Schema } from 'mongoose';
import { SellerModelPerma } from '../../../../models/seller/schema/sellerPerma';
import { imageProcessorFunction } from './imageWorker/imageProcessorFunction';
import { io } from '../../../../startSocket';
import { AdminModelPerma } from '../../../../models/admin/schema/adminPerma';
const addProduct: sync_middleware_type = async_error_handler(
  async (req: requestWithPermaSeller, res, next) => {
    const {
      name,
      description = '',
      price,
      category,
      stock = 1,
      images = [],
      tags,
    } = req.body;
    const product = ProductModel.build({
      name,
      description,
      price,
      category,
      tags,
      sellerId: req.seller!._id as mongoose.Types.ObjectId,
      stock,
      images,
    });
    // imageProcessorFunction(images, product._id as Schema.Types.ObjectId);
    await product.save();
    await SellerModelPerma.findByIdAndUpdate(req.seller!._id, {
      $push: { products: product._id },
    });
    const admins = await AdminModelPerma.find({}, { _id: true });
    admins.forEach((elem) => {
      if (global.connectedUsers.get(elem._id!.toString()) != undefined)
        io.to(global.connectedUsers.get(elem._id!.toString())!).emit(
          'newProductArrived'
        );
    });
    console.log('vdhj');
    const response = new Custom_response(
      true,
      null,
      'productLodgedSuccessfully',
      'success',
      200,
      null
    );
    res.status(response.statusCode).json(response);
  }
);
export { addProduct };
