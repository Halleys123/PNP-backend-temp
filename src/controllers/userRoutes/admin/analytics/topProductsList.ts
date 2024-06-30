import {
  Custom_response,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { OrderModel } from '../../../../models/orders/schema/orders';
import { OrderStatus } from '../../../../types/types';
import { ProductModel } from '../../../../models/products/schema/products';

const topProductsList: sync_middleware_type = async_error_handler(
  async (req, res, next) => {
    const {
      pageNo = 1,
      pageSize = 10,
      from,
      to,
      isDelivered,
      orderType,
      sortBy,
    } = req.query;

    let parsedPageNo = parseInt(pageNo!.toString());
    let parsedPageSize = parseInt(pageSize!.toString());

    const filters: any = {};

    if (from) filters['startTime'] = { $gte: new Date(from.toString()) };
    if (to) {
      if (filters['startTime'])
        filters['startTime']['$lte'] = new Date(to.toString());
      else filters['startTime'] = { $lte: new Date(to.toString()) };
    }
    if (isDelivered) {
      if (isDelivered == 'true') filters['isDroppedCompletely'] = true;
      else if (isDelivered == 'false') filters['isDroppedCompletely'] = false;
    }
    if (orderType) filters['orderType'] = orderType;
    filters['orderStatus'] = OrderStatus.PROCESSED;
    const successfulOrders = await OrderModel.find(filters);

    const topProductsMap: {
      [productId: string]: {
        productId: string;
        quantityBought: number;
        totalPrice: number;
      };
    } = {};

    for (let i = 0; i < successfulOrders.length; i++) {
      for (let j = 0; j < successfulOrders[i].productsBought.length; j++) {
        const product = successfulOrders[i].productsBought[j];
        const productIdStr = product.productId.toString();
        if (topProductsMap[productIdStr]) {
          topProductsMap[productIdStr].quantityBought += product.quantityBought;
          topProductsMap[productIdStr].totalPrice += product.totalPrice;
        } else {
          topProductsMap[productIdStr] = {
            productId: productIdStr,
            quantityBought: product.quantityBought,
            totalPrice: product.totalPrice,
          };
        }
      }
    }

    const topProducts = Object.values(topProductsMap);

    topProducts.sort((a, b) => {
      if (sortBy == 'quantitySold') return b.quantityBought - a.quantityBought;
      else return b.totalPrice - a.totalPrice;
    });

    const populatedTopProducts = await Promise.all(
      topProducts.map(async (elem) => {
        const product = await ProductModel.findById(elem.productId).populate(
          'sellerId',
          {
            address: false,
            accountInfo: false,
            sessions: false,
            productsSold: false,
            products: false,
          }
        );
        return {
          product,
          totalPrice: elem.totalPrice,
          quantitySold: elem.quantityBought,
        };
      })
    );
    const length = populatedTopProducts.length;
    const paginatedProducts = populatedTopProducts.slice(
      (parsedPageNo - 1) * parsedPageSize,
      parsedPageNo * parsedPageSize
    );

    console.log(paginatedProducts);
    const response = new Custom_response(
      true,
      null,
      { topProducts: paginatedProducts, totalProducts: length },
      'success',
      200,
      null
    );
    res.status(response.statusCode).json(response);
  }
);

export { topProductsList };
