import {
  Custom_response,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { OrderModel } from '../../../../models/orders/schema/orders';
import { OrderStatus } from '../../../../types/types';
import { ProductModel } from '../../../../models/products/schema/products';
import { SellerModelPerma } from '../../../../models/seller/schema/sellerPerma';

const topSellersList: sync_middleware_type = async_error_handler(
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
        if (topProductsMap[product.productId.toString()]) {
          topProductsMap[product.productId.toString()].quantityBought +=
            product.quantityBought;
          topProductsMap[product.productId.toString()].totalPrice +=
            product.totalPrice;
        } else {
          topProductsMap[product.productId.toString()] = {
            productId: product.productId.toString(),
            quantityBought: product.quantityBought,
            totalPrice: product.totalPrice,
          };
        }
      }
    }

    const topProducts = Object.values(topProductsMap);
    let topSellersMap: {
      [sellerId: string]: {
        sellerId: string;
        productIds: string[];
        quantitySold: number[];
        totalPrice: number[];
        netRevenue: number;
        netProductsSold: number;
      };
    } = {};

    for (let i = 0; i < topProducts.length; i++) {
      const product = await ProductModel.findById(topProducts[i].productId);
      const sellerIdStr = product!.sellerId.toString();
      if (topSellersMap[sellerIdStr]) {
        const sellerData = topSellersMap[sellerIdStr];
        sellerData.productIds.push(product!._id!.toString());
        sellerData.quantitySold.push(topProducts[i].quantityBought);
        sellerData.totalPrice.push(topProducts[i].totalPrice);
        sellerData.netRevenue += topProducts[i].totalPrice;
        sellerData.netProductsSold += topProducts[i].quantityBought;
      } else {
        topSellersMap[sellerIdStr] = {
          sellerId: sellerIdStr,
          productIds: [product!._id!.toString()],
          quantitySold: [topProducts[i].quantityBought],
          totalPrice: [topProducts[i].totalPrice],
          netRevenue: topProducts[i].totalPrice,
          netProductsSold: topProducts[i].quantityBought,
        };
      }
    }

    const topSellers = Object.values(topSellersMap);
    topSellers.sort((a, b) => {
      if (sortBy == 'netProductsSold')
        return b.netProductsSold - a.netProductsSold;
      else return b.netRevenue - a.netRevenue;
    });
    const topSellersInfo = topSellers.map(async (elem) => {
      const seller = await SellerModelPerma.findById(elem.sellerId, {
        name: true,
        email: true,
        phoneNumber: true,
      });
      return {
        seller,
        netProductsSold: elem.netProductsSold,
        quantitySold: elem.quantitySold,
        productIds: elem.productIds,
        totalPriceOfEachProduct: elem.totalPrice,
        netRevenue: elem.netRevenue,
      };
    });
    const length = topSellersList.length;
    const paginatedTopSellers = (await Promise.all(topSellersInfo)).slice(
      (parsedPageNo - 1) * parsedPageSize,
      parsedPageNo * parsedPageSize
    );

    const response = new Custom_response(
      true,
      null,
      { topSellers: paginatedTopSellers, totalSellers: length },
      'success',
      200,
      null
    );
    res.status(response.statusCode).json(response);
  }
);

export { topSellersList };
