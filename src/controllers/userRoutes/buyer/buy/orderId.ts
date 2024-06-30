import {
  Custom_error,
  Custom_response,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { razorpayInstance } from '../../../../server';
import { OrderType, requestWithOrder } from '../../../../types/types';
const createOrderId: sync_middleware_type = async_error_handler(
  async (req: requestWithOrder, res, next) => {
    if (req.order!.orderType != OrderType.ONLINE_PAYMENT)
      throw new Custom_error({
        errors: [{ message: 'notSetToOnlinePayment' }],
        statusCode: 400,
      });
    console.log(req.order);
    const amount = req.order!.amount * 100;
    console.log(amount);
    var options = {
      amount: amount,
      currency: 'INR',
      receipt: 'rcp1',
    };
    razorpayInstance.orders.create(options, function (err, order) {
      console.log(err);
      if (!err) {
        const response = new Custom_response(
          true,
          null,
          { orderId: order.id },
          'success',
          200,
          null
        );
        res.status(response.statusCode).json(response);
      } else {
        throw new Custom_error({
          errors: [{ message: JSON.stringify(err.error) }],
          statusCode: 400,
        });
      }
    });
  }
);
export { createOrderId };
