import {
  Custom_response,
  async_error_handler,
  sync_middleware_type,
} from "@himanshu_guptaorg/utils";
import { OrderStatus, requestWithPermaSeller } from "../../../../types/types";
import { OrderModel } from "../../../../models/orders/schema/orders";
import { ProductModel } from "../../../../models/products/schema/products";

const topProducts: sync_middleware_type = async_error_handler(
  async (req: requestWithPermaSeller, res, next) => {
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

    if (from) filters["startTime"] = { $gte: new Date(from.toString()) };
    if (to) {
      if (filters["startTime"])
        filters["startTime"]["$lte"] = new Date(to.toString());
      else filters["startTime"] = { $lte: new Date(to.toString()) };
    }
    if (isDelivered) {
      if (isDelivered == "true") filters["isDroppedCompletely"] = true;
      else if (isDelivered == "false") filters["isDroppedCompletely"] = false;
    }
    if (orderType) filters["orderType"] = orderType;
    filters["orderStatus"] = OrderStatus.PROCESSED;

    const transactions = req.seller!.productsSold;

    const topProductsMap: {
      [productId: string]: {
        productId: string;
        quantitySold: number;
        totalPrice: number;
      };
    } = {};

    for (let i = 0; i < transactions.length; i++) {
      filters["_id"] = transactions[i].orderId;
      const order = await OrderModel.findOne(filters);
      if (order) {
        const productToString = transactions[i].productId.toString();
        if (topProductsMap[productToString]) {
          topProductsMap[productToString].quantitySold +=
            transactions[i].quantitySold;
          topProductsMap[productToString].totalPrice +=
            transactions[i].totalPrice;
        } else {
          topProductsMap[productToString] = {
            quantitySold: transactions[i].quantitySold,
            totalPrice: transactions[i].totalPrice,
            productId: productToString,
          };
        }
      }
    }

    const topProducts = Object.values(topProductsMap);

    topProducts.sort((a, b) => {
      if (sortBy == "quantitySold") return b.quantitySold - a.quantitySold;
      else return b.totalPrice - a.totalPrice;
    });
    const populatedTopProducts = await Promise.all(
      topProducts.map(async (elem) => {
        const product = await ProductModel.findById(elem.productId);
        return {
          product,
          quantitySold: elem.quantitySold,
          totalPrice: elem.totalPrice,
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
      "success",
      200,
      null
    );
    res.status(response.statusCode).json(response);
  }
);
export { topProducts };
