import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import {
  Custom_response,
  async_error_handler,
  sync_middleware_type,
} from "@himanshu_guptaorg/utils";
import { ProductModel } from "../../../../models/products/schema/products";
import { productVerificationStatus } from "../../../../types/types";

const getProducts: sync_middleware_type = async_error_handler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { pageNo = 1 } = req.query;
    const pageSize = 4;
    const parsedPageNo = parseInt(pageNo.toString());
    const products = await ProductModel.find({
      "verificationDetails.verificationStatus":
        productVerificationStatus.ACCEPTED,
    });
    const totalProducts = products.length;
    const paginatedProducts = products.splice(
      (parsedPageNo - 1) * pageSize,
      pageSize
    );
    const response = new Custom_response(
      true,
      null,
      { products: paginatedProducts, totalProducts },
      "success",
      200,
      null
    );

    res.status(response.statusCode).json(response);
  }
);

export { getProducts };
