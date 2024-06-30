import {
  Custom_error,
  Custom_response,
  async_error_handler,
} from '@himanshu_guptaorg/utils';
import {
  OrderStatus,
  OrderType,
  requestWithOrder,
} from '../../../../types/types';
import { OrderModel } from '../../../../models/orders/schema/orders';

const onlinePayment = async_error_handler(
  async (req: requestWithOrder, res, next) => {
    if (req.order?.orderType) {
      throw new Custom_error({
        errors: [{ message: 'orderTypeAlreadySet' }],
        statusCode: 400,
      });
    }
    await OrderModel.findByIdAndUpdate(req.order!._id, {
      $set: {
        orderType: OrderType.ONLINE_PAYMENT,
      },
    });
    const response = new Custom_response(
      true,
      null,
      'setToPayOnline',
      'success',
      200,
      null
    );
    res.status(response.statusCode).json(response);
  }
);
export { onlinePayment };
