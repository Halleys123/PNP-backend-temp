import {
  Custom_error,
  Custom_response,
  async_error_handler,
  sync_middleware_type,
} from "@himanshu_guptaorg/utils";
import { ProductModel } from "../../../../models/products/schema/products";

const getProductById: sync_middleware_type = async_error_handler(
  async (req, res, next) => {
    const { id } = req.query;

    if (!id) {
      throw new Custom_error({
        errors: [{ message: "sendTheId" }],
        statusCode: 400,
      });
    }

    const product = await ProductModel.findById(id).populate("sellerId", {
      password: false,
      sessions: false,
      address: false,
      productsSold: false,
      products: false,
      createdOn: false,
    });

    if (!product) {
      throw new Custom_error({
        errors: [{ message: "productNotFound" }],
        statusCode: 404,
      });
    }
    const response = new Custom_response(
      true,
      null,
      { product },
      "success",
      200,
      null
    );
    res.status(response.statusCode).json(response);
  }
);

export { getProductById };
