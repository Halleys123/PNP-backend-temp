import {
  Custom_error,
  Custom_response,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { OrderModel } from '../../../models/orders/schema/orders';
import { OrderStatus } from '../../../types/types';

const initiateDelivery: sync_middleware_type = async_error_handler(
  async (req, res, next) => {
    const orderId = req.body.orderId;
    const order = await OrderModel.findById(orderId);
    if (!order)
      throw new Custom_error({
        errors: [{ message: 'noSuchOrder' }],
        statusCode: 404,
      });
    if (order.isCompletelyDropped)
      throw new Custom_error({
        errors: [{ message: 'alreadyDropped' }],
        statusCode: 404,
      });
    if (order.orderStatus != OrderStatus.PROCESSED)
      throw new Custom_error({
        errors: [{ message: 'orderNotProcessed' }],
        statusCode: 404,
      });
    // TODO::implement the logic to send a request to ekart to deliver product
    await OrderModel.findByIdAndUpdate(order._id, {
      $set: {
        delivery: {
          orderId: '123',
          trackingId: 'abc',
        },
      },
    });
    const response = new Custom_response(
      true,
      null,
      'successfullySetToDelivery',
      'success',
      200,
      null
    );
    res.status(response.statusCode).json(response);
  }
);
export { initiateDelivery };
