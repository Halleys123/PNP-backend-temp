import {
  Custom_response,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { requestWithPermaBuyer } from '../../../../types/types';
import { BuyerModelPerma } from '../../../../models/buyer/schema/buyerPerma';

const getCartDetails: sync_middleware_type = async_error_handler(
  async (req: requestWithPermaBuyer, res, next) => {
    const populatedCart = await BuyerModelPerma.findById(
      req.buyer!._id
    ).populate({ path: 'cart' });
    const response = new Custom_response(
      true,
      null,
      { cart: populatedCart?.cart },
      'success',
      200,
      null
    );
    res.status(response.statusCode).json(response);
  }
);
export { getCartDetails };
