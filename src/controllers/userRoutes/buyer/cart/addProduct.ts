import {
  Custom_error,
  Custom_response,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { ProductModel } from '../../../../models/products/schema/products';
import { BuyerModelPerma } from '../../../../models/buyer/schema/buyerPerma';
import { requestWithPermaBuyer } from '../../../../types/types';
import mongoose from 'mongoose';

const addProduct: sync_middleware_type = async_error_handler(
  async (req: requestWithPermaBuyer, res, next) => {
    const { productId, quantity } = req.body;
    const product = await ProductModel.findById(productId);
    if (!product)
      throw new Custom_error({
        errors: [{ message: 'noSuchProduct' }],
        statusCode: 404,
      });
    if (product.stock == 0)
      throw new Custom_error({
        errors: [{ message: 'outOfStock' }],
        statusCode: 400,
      });
    for (let i = 0; i < req.buyer!.cart.length; i++) {
      if (
        req.buyer!.cart[i].productId == (productId as mongoose.Types.ObjectId)
      )
        throw new Custom_error({
          errors: [{ message: 'alreadyInYourCart' }],
          statusCode: 200,
        });
    }
    if (!quantity)
      throw new Custom_error({
        errors: [{ message: 'sendTheQuantity' }],
        statusCode: 400,
      });
    await BuyerModelPerma.findByIdAndUpdate(req.buyer!._id, {
      $push: { cart: { productId, quantity } },
    });

    const response = new Custom_response(
      true,
      null,
      'addedSuccessfullyToCart',
      'success',
      200,
      null
    );
    res.status(response.statusCode).json(response);
  }
);
export { addProduct };
