import { Custom_response, async_error_handler } from '@himanshu_guptaorg/utils';
import { requestWithPermaAdmin } from '../../../../../types/types';
import { SessionModel } from '../../../../../models/sessions/schema/sesssions';
import { AdminModelPerma } from '../../../../../models/admin/schema/adminPerma';

const changePasswordLogout = async_error_handler(
  async (req: requestWithPermaAdmin, res, next) => {
    const user = req.admin!;
    user.sessions.forEach(async (elem) => {
      await SessionModel.findByIdAndDelete(elem);
    });
    await AdminModelPerma.findByIdAndUpdate(user._id, {
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
