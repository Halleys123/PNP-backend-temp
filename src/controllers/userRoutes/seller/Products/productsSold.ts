import {
  Custom_response,
  async_error_handler,
  sync_middleware_type,
} from "@himanshu_guptaorg/utils";
import { requestWithPermaSeller } from "../../../../types/types";
import { SellerModelPerma } from "../../../../models/seller/schema/sellerPerma";

const getProductsSold: sync_middleware_type = async_error_handler(
  async (req: requestWithPermaSeller, res, next) => {
    const sellerId = req.seller!._id; // Assuming req.seller!._id is the seller's ID

    const seller = await SellerModelPerma.findById(sellerId)
      .populate({
        path: "productsSold.productId",
        model: "Product",
      })
      .populate({
        path: "productsSold.orderId",
        model: "Order",
      });

    const productsSold = seller?.productsSold; // Array of populated productsSold
    const response = new Custom_response(
      true,
      null,
      productsSold,
      "success",
      200,
      null
    );
    res.status(response.statusCode).json(response);
  }
);

export { getProductsSold };
