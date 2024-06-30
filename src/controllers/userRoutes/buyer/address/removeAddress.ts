import {
  Custom_error,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { BuyerModelPerma } from '../../../../models/buyer/schema/buyerPerma';
import { requestWithPermaBuyer } from '../../../../types/types';

const removeAddresss: sync_middleware_type = async_error_handler(
  async (req: requestWithPermaBuyer, res, next) => {
    const { addressIndex } = req.body;
    if (!addressIndex) {
      throw new Custom_error({
        errors: [{ message: 'sendMeTheAddressIndex' }],
        statusCode: 400,
      });
    }
    req.buyer!.address.splice(addressIndex, 1);
    await BuyerModelPerma.findByIdAndUpdate(req.buyer!._id, {
      $set: { address: req.buyer!.address },
    });
  }
);
