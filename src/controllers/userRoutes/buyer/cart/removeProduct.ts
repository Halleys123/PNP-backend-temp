import {
  Custom_error,
  Custom_response,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { BuyerModelPerma } from '../../../../models/buyer/schema/buyerPerma';
import { requestWithPermaBuyer } from '../../../../types/types';
const removeProduct: sync_middleware_type = async_error_handler(
  async (req: requestWithPermaBuyer, res, next) => {
    const productId = req.body.productId;
    if (!productId)
      throw new Custom_error({
        errors: [{ message: 'sendTheProductId' }],
        statusCode: 400,
      });
    let i;
    for (i = 0; i < req.buyer!.cart.length; i++) {
      if (req.buyer!.cart[i].productId.toString() == productId) {
        console.log('hdjhfd');
        break;
      }
    }
    req.buyer!.cart.splice(i, 1);
    console.log(req.buyer);
    await BuyerModelPerma.findByIdAndUpdate(req.buyer!._id, {
      $set: { cart: req.buyer!.cart },
    });
    const response = new Custom_response(
      true,
      null,
      'removedFromCart',
      'success',
      200,
      null
    );
    res.status(response.statusCode).json(response);
  }
);
export { removeProduct };
