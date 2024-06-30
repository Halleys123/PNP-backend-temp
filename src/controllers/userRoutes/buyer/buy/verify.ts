import {
  Custom_error,
  Custom_response,
  async_error_handler,
} from '@himanshu_guptaorg/utils';
import crypto from 'crypto';
import { TransactionModel } from '../../../../models/transactions/schema/schema';
import {
  OrderStatus,
  TransactionStatus,
  requestWithOrder,
} from '../../../../types/types';
import { OrderModel } from '../../../../models/orders/schema/orders';
import mongoose, { mongo } from 'mongoose';
const verifySignature = async_error_handler(
  async (req: requestWithOrder, res, next) => {
    console.log(req.body);
    let body = req.body.razorpay_order_id + '|' + req.body.razorpay_payment_id;
    let expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest('hex');
    console.log(expectedSignature);
    console.log(req.body);
    if (expectedSignature != req.body.razorpay_signature) {
      const transaction = TransactionModel.build({
        buyerId: req.buyer!._id as mongoose.Types.ObjectId,
        databaseOrderId: req.order!._id as mongoose.Types.ObjectId,
        amount: req.order!.amount,
        transactionStatus: TransactionStatus.FAILED,
        orderId: req.body.razorpay_order_id,
        paymentId: req.body.razorpay_payment_id,
        paymentSignature: expectedSignature,
      });
      await OrderModel.findByIdAndUpdate(req.order!._id, {
        transactionId: transaction._id,
        orderStatus: OrderStatus.FAILED,
      });

      throw new Custom_error({
        errors: [{ message: 'signatureNotMatching' }],
        statusCode: 403,
      });
    }
    const transaction = TransactionModel.build({
      buyerId: req.buyer!._id as mongoose.Types.ObjectId,
      databaseOrderId: req.order!._id as mongoose.Types.ObjectId,
      amount: req.order!.amount,
      transactionStatus: TransactionStatus.COMPLETED,
      orderId: req.body.razorpay_order_id,
      paymentId: req.body.razorpay_payment_id,
      paymentSignature: expectedSignature,
    });
    await transaction.save();
    await OrderModel.findByIdAndUpdate(req.order!._id, {
      transactionId: transaction._id,
      orderStatus: OrderStatus.PROCESSED,
    });
    const response = new Custom_response(
      true,
      null,
      'transactionProcessed',
      'success',
      200,
      null
    );
    res.status(response.statusCode).json(response);
  }
);
export { verifySignature };
