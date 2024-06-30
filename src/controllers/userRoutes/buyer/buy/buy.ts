import {
  Custom_error,
  Custom_response,
  async_error_handler,
  createJwt,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { OrderStatus, requestWithPermaBuyer } from '../../../../types/types';
import {
  ProductDoc,
  ProductModel,
} from '../../../../models/products/schema/products';
import mongoose from 'mongoose';
import { BuyerModelPerma } from '../../../../models/buyer/schema/buyerPerma';
import { OrderModel } from '../../../../models/orders/schema/orders';
import { SellerModelPerma } from '../../../../models/seller/schema/sellerPerma';

interface ProductFromReq {
  productId: string;
  quantity: number;
}

const buy: sync_middleware_type = async_error_handler(
  async (req: requestWithPermaBuyer, res, next) => {
    const { cart, addressIndex } = req.body;
    console.log(req.body);
    if (addressIndex == undefined || addressIndex == null) {
      throw new Custom_error({
        errors: [{ message: 'sendTheAddressIndex' }],
        statusCode: 400,
      });
    }
    const address = req.buyer!.address[addressIndex];
    if (!address) {
      throw new Custom_error({
        errors: [{ message: 'noSuchAddress' }],
        statusCode: 400,
      });
    }

    if (!cart || !cart.length) {
      throw new Custom_error({
        errors: [{ message: 'sendTheProducts' }],
        statusCode: 400,
      });
    }

    const productsFromDatabase: ProductDoc[] = [];
    const finalProductArray: ProductFromReq[] = [];
    let totalPrice = 0;
    const productsBought: {
      isDropped: boolean;
      productId: mongoose.Types.ObjectId;
      quantityBought: number;
      totalPrice: number;
    }[] = [];
    const productsBoughtWithCost: {
      productId: mongoose.Types.ObjectId;
      quantityBought: number;
      cost: number;
    }[] = [];
    for (const elem of cart) {
      const product = await ProductModel.findById(elem.productId);
      if (!product) {
        throw new Custom_error({
          errors: [{ message: 'noSuchProduct' }],
          statusCode: 404,
        });
      }
      if (product.stock === 0) continue;

      productsFromDatabase.push(product);

      const quantity = elem.quantity
        ? Math.min(elem.quantity, product.stock)
        : 1;

      finalProductArray.push({ productId: elem.productId, quantity });
      totalPrice += product.price * quantity;

      productsBought.push({
        productId: elem.productId,
        isDropped: false,
        quantityBought: quantity,
        totalPrice: product.price * quantity,
      });
      productsBoughtWithCost.push({
        productId: elem.productId,
        quantityBought: quantity,
        cost: product.price * quantity,
      });
      await ProductModel.findByIdAndUpdate(elem.productId, {
        $set: { stock: product.stock - quantity },
      });
    }

    const order = OrderModel.build({
      placedBy: req.buyer!._id as mongoose.Types.ObjectId,
      isCompletelyDropped: false,
      isSorted: false,
      productsBought,
      dropAddress: address,
      amount: totalPrice,
    });
    await order.save();

    const sellerUpdates = productsFromDatabase.map((product, i) => {
      return SellerModelPerma.findByIdAndUpdate(product.sellerId, {
        $push: {
          productsSold: {
            productId: finalProductArray[i].productId,
            quantitySold: finalProductArray[i].quantity,
            orderId: order._id,
            totalPrice: finalProductArray[i].quantity * product.price,
          },
        },
      });
    });
    await Promise.all(sellerUpdates);
    const orderJwt = await createJwt(
      {
        payload: { _id: order._id },
        options: { expiresIn: process.env.MAX_TRANSACTION_TIME! },
      },
      process.env.TRANSACTION_TOKEN_SECRET!
    );
    await BuyerModelPerma.findByIdAndUpdate(req.buyer!._id, {
      $push: { transactions: { orderId: order._id } },
    });
    const expiresIn = process.env.MAX_TRANSACTION_TIME;
    setTimeout(async () => {
      const myOrder = await OrderModel.findById(order._id);
      console.log(myOrder);
      if (myOrder?.orderStatus == OrderStatus.PENDING) {
        await OrderModel.findByIdAndUpdate(myOrder._id, {
          $set: { orderStatus: OrderStatus.FAILED },
        });
        const productUpdates = myOrder.productsBought.map(
          async ({ productId, quantityBought }) => {
            const product = await ProductModel.findById(productId);
            await ProductModel.findByIdAndUpdate(productId, {
              $set: { stock: quantityBought + (product?.stock || 0) },
            });
          }
        );
        await Promise.all(productUpdates);
      }
    }, 1000 * 60 * parseInt(expiresIn!.substring(0, expiresIn!.length - 1)));

    const response = new Custom_response(
      true,
      null,
      { orderToken: orderJwt, totalPrice, productsBoughtWithCost },
      'success',
      200,
      null
    );
    res.status(response.statusCode).json(response);
  }
);

export { buy };
