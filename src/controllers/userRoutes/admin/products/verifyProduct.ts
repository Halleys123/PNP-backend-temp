import {
  Custom_error,
  Custom_response,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { ProductModel } from '../../../../models/products/schema/products';
import {
  productVerificationStatus,
  requestWithPermaAdmin,
} from '../../../../types/types';
import { AdminModelPerma } from '../../../../models/admin/schema/adminPerma';
import { io } from '../../../../startSocket';

const verifyProduct: sync_middleware_type = async_error_handler(
  async (req: requestWithPermaAdmin, res, next) => {
    let { productToBeVerified, tags, verificationStatus, rejectionReason } =
      req.body;
    if (!productToBeVerified)
      throw new Custom_error({
        errors: [{ message: 'sendAProduct' }],
        statusCode: 400,
      });
    if (typeof verificationStatus != 'string')
      throw new Custom_error({
        errors: [{ message: 'toVerifyFieldMustBeABoolean' }],
        statusCode: 400,
      });
    const product = await ProductModel.findById(productToBeVerified);
    if (
      product?.verificationDetails.verificationStatus !=
      productVerificationStatus.PENDING
    )
      throw new Custom_error({
        errors: [{ message: 'theProductVerificationIsNotPending' }],
        statusCode: 400,
      });
    if (!product)
      throw new Custom_error({
        errors: [{ message: 'noSuchProduct' }],
        statusCode: 400,
      });
    if (!tags) {
      tags = product.tags;
    }
    if (!rejectionReason) rejectionReason = '';
    await ProductModel.findByIdAndUpdate(productToBeVerified, {
      $set: {
        'verificationDetails.verifiedBy': req.admin!._id,
        'verificationDetails.verificationStatus': verificationStatus,
        'verificationDetails.rejectionReason': rejectionReason,
      },
    });
    const admins = await AdminModelPerma.find({}, { _id: true });
    admins.forEach((elem) => {
      if (global.connectedUsers.get(elem._id!.toString()) != undefined)
        io.to(global.connectedUsers.get(elem._id!.toString())!).emit(
          'newProductArrived'
        );
    });
    const response = new Custom_response(
      true,
      null,
      'veificationDone',
      'success',
      200,
      null
    );
    res.status(response.statusCode).json(response);
  }
);
export { verifyProduct };
