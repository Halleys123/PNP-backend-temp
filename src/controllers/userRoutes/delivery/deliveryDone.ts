import {
  Custom_error,
  Custom_response,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { DeliveryStatus, OrderStatus } from '../../../types/types';
import { OrderModel } from '../../../models/orders/schema/orders';

const deliveryDone: sync_middleware_type = async_error_handler(
  async (req, res, next) => {
    const orderId = req.body.orderId;
    if (!orderId)
      throw new Custom_error({
        errors: [{ message: 'sendOrderId' }],
        statusCode: 400,
      });
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

    if (order.deliveryStatus != DeliveryStatus.ON_THE_GO)
      throw new Custom_error({
        errors: [{ message: 'orderNotInitiated' }],
        statusCode: 400,
      });
    await OrderModel.findByIdAndUpdate(order._id, {
      $set: {
        isDroppedCompletely: true,
        deliveryStatus: DeliveryStatus.DELIVERED,
      },
    });
    const response = new Custom_response(
      true,
      null,
      'deliveryDone',
      'success',
      200,
      null
    );
    res.status(response.statusCode).json(response);
  }
);
export { deliveryDone };
