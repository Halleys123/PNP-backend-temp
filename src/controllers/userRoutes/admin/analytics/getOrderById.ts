import {
  Custom_error,
  Custom_response,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { OrderModel } from '../../../../models/orders/schema/orders';

const getOrderById: sync_middleware_type = async_error_handler(
  async (req, res, next) => {
    const id = req.query.id;
    if (!id)
      throw new Custom_error({
        errors: [{ message: 'sendId' }],
        statusCode: 400,
      });
    const order = await OrderModel.findById(id.toString()).populate('placedBy');
    if (!order)
      throw new Custom_error({
        errors: [{ message: 'noSuchOrder' }],
        statusCode: 404,
      });
    const response = new Custom_response(
      true,
      null,
      { order: order },
      'success',
      200,
      null
    );
    res.status(response.statusCode).json(response);
  }
);
export { getOrderById };
