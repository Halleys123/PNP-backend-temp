import { Custom_response, async_error_handler } from '@himanshu_guptaorg/utils';
import { requestWithPermaBuyer } from '../../../../../types/types';
import { SessionModel } from '../../../../../models/sessions/schema/sesssions';
import { BuyerModelPerma } from '../../../../../models/buyer/schema/buyerPerma';

const changePasswordLogout = async_error_handler(
  async (req: requestWithPermaBuyer, res, next) => {
    const user = req.buyer!;
    user.sessions.forEach(async (elem) => {
      await SessionModel.findByIdAndDelete(elem);
    });
    await BuyerModelPerma.findByIdAndUpdate(user._id, {
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
