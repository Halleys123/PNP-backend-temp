import {
  Custom_response,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { requestWithPermaSeller } from '../../../../types/types';
import { SellerModelPerma } from '../../../../models/seller/schema/sellerPerma';

const getMyProducts: sync_middleware_type = async_error_handler(
  async (req: requestWithPermaSeller, res, next) => {
    const userWithProduct = await SellerModelPerma.findById(
      req.seller!._id
    ).populate('products');
    const response = new Custom_response(
      true,
      null,
      userWithProduct,
      'success',
      200,
      null
    );
    res.status(response.statusCode).json(response);
  }
);
export { getMyProducts };
