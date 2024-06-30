import {
  Custom_error,
  Custom_response,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { BuyerModelPerma } from '../../../../models/buyer/schema/buyerPerma';
import { requestWithPermaBuyer } from '../../../../types/types';

const addAddress: sync_middleware_type = async_error_handler(
  async (req: requestWithPermaBuyer, res, next) => {
    const { address } = req.body;
    if (
      !address ||
      !address.houseNumber ||
      !address.street ||
      !address.city ||
      !address.pincode
    )
      throw new Custom_error({
        errors: [{ message: 'sendCompleteAddress' }],
        statusCode: 400,
      });
    await BuyerModelPerma.findByIdAndUpdate(req.buyer!._id, {
      $push: { address },
    });
    const response = new Custom_response(
      true,
      null,
      'addedAddress',
      'success',
      200,
      null
    );
    res.status(response.statusCode).json(response);
  }
);
export { addAddress };
