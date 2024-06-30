import {
  Custom_response,
  async_error_handler,
  sync_middleware_type,
} from "@himanshu_guptaorg/utils";
import { ProductModel } from "../../../../models/products/schema/products";
import { productVerificationStatus } from "../../../../types/types";

const getUnverifiedProducts: sync_middleware_type = async_error_handler(
  async (req, res, next) => {
    const { pageNo = 1, pageSize = 10 } = req.query;
    let parsedPageNo = parseInt(pageNo!.toString());
    let parsedPageSize = parseInt(pageSize!.toString());
    const unverifiedProducts = await ProductModel.find({
      "verificationDetails.verificationStatus":
        productVerificationStatus.PENDING,
    }).populate("sellerId", {
      name: true,
      email: true,
      phone: true,
      address: true,
    });
    const length = unverifiedProducts.length;
    const paginatedProducts = unverifiedProducts.splice(
      (parsedPageNo - 1) * parsedPageSize,
      parsedPageSize
    );
    const response = new Custom_response(
      true,
      null,
      {
        unverifiedProducts: paginatedProducts,
        totalProducts: length,
      },
      "success",
      200,
      null
    );
    res.status(response.statusCode).json(response);
  }
);
export { getUnverifiedProducts };
