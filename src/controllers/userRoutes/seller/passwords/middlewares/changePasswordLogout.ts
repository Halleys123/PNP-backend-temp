import { Custom_response, async_error_handler } from '@himanshu_guptaorg/utils';
import { requestWithPermaSeller } from '../../../../../types/types';
import { SessionModel } from '../../../../../models/sessions/schema/sesssions';
import { SellerModelPerma } from '../../../../../models/seller/schema/sellerPerma';

const changePasswordLogout = async_error_handler(
  async (req: requestWithPermaSeller, res, next) => {
    const user = req.seller!;
    user.sessions.forEach(async (elem) => {
      await SessionModel.findByIdAndDelete(elem);
    });
    await SellerModelPerma.findByIdAndUpdate(user._id, {
      $set: { sessions: [] },
    });
    const response = new Custom_response(
      true,
      null,
      'passwordChanged',
      'success',
      200,
      null
    );

    res.status(response.statusCode).json(response);
  }
);
export { changePasswordLogout };
