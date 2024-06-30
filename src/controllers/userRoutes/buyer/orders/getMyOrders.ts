import { Custom_response, async_error_handler } from '@himanshu_guptaorg/utils';
import { requestWithPermaBuyer } from '../../../../types/types';
import { BuyerModelPerma } from '../../../../models/buyer/schema/buyerPerma';

const getMyOrders = async_error_handler(
  async (req: requestWithPermaBuyer, res, next) => {
    const userWithOrders = await BuyerModelPerma.findById(
      req.buyer?._id
    ).populate('transactions.orderId');
    const response = new Custom_response(
      true,
      null,
      {
        orders: userWithOrders?.transactions,
      },
      'success',
      200,
      null
    );
    res.status(response.statusCode).json(response);
  }
);
export { getMyOrders };
