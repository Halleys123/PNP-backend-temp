import {
  Custom_error,
  async_error_handler,
  jwtVerification,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { TransactionModel } from '../../../../../models/transactions/schema/schema';
import { OrderStatus, requestWithOrder } from '../../../../../types/types';
import { OrderModel } from '../../../../../models/orders/schema/orders';
import mongoose from 'mongoose';

const attachOrder: sync_middleware_type = async_error_handler(
  async (req: requestWithOrder, res, next) => {
    const transactionJwt = req.headers.transaction as string;
    if (!transactionJwt)
      throw new Custom_error({
        errors: [{ message: 'noJwt' }],
        statusCode: 403,
      });
    if (!transactionJwt.startsWith('Bearer'))
      throw new Custom_error({
        errors: [{ message: 'invalidJwt' }],
        statusCode: 401,
      });
    const decodedToken = (await jwtVerification(
      transactionJwt.split(' ')[1],
      process.env.TRANSACTION_TOKEN_SECRET!
    )) as { _id: string };
    const order = await OrderModel.findById(decodedToken._id);
    if (!order)
      throw new Custom_error({
        errors: [{ message: 'noSuchTransaction' }],
        statusCode: 404,
      });
    if (order.orderStatus != OrderStatus.PENDING)
      throw new Custom_error({
        errors: [{ message: 'thisTransactionIsNotPending' }],
        statusCode: 401,
      });
    if (new Date(order.expireTime) < new Date(Date.now()))
      throw new Custom_error({
        errors: [{ message: 'orderExpired' }],
        statusCode: 400,
      });
    let found = false;
    for (let i = 0; i < req.buyer!.transactions.length; i++) {
      const elem = req.buyer!.transactions[i];
      console.log(elem, order._id);
      if (JSON.stringify(elem.orderId) == JSON.stringify(order._id)) {
        found = true;
        break;
      }
    }
    if (found == false)
      throw new Custom_error({
        errors: [{ message: 'notYourOrder' }],
        statusCode: 401,
      });
    req.order = order;
    next();
  }
);
export { attachOrder };
