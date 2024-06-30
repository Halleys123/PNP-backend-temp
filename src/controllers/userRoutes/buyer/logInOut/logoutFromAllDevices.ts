import {
  Custom_response,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import {
  BuyerDocPerma,
  BuyerModelPerma,
} from '../../../../models/buyer/schema/buyerPerma';
import {
  SessionDoc,
  SessionModel,
} from '../../../../models/sessions/schema/sesssions';
import {
  requestWithPermaBuyerAndSession,
  roles,
} from '../../../../types/types';
const logoutFromAllDevices: sync_middleware_type = async_error_handler(
  async (req: requestWithPermaBuyerAndSession, res, next) => {
    const logoutThisDevice = req.query.logoutThisDevice;
    const session = req.session as SessionDoc;
    const user = req.buyer as BuyerDocPerma;
    if (logoutThisDevice == 'true') {
      user.sessions.forEach(async (elem) => {
        await SessionModel.findByIdAndDelete(elem);
      });
      await BuyerModelPerma.findByIdAndUpdate(user._id, {
        $set: { sessions: [] },
      });
    } else {
      user.sessions.forEach(async (elem) => {
        if (JSON.stringify(session._id) != JSON.stringify(elem)) {
          await SessionModel.findByIdAndDelete(elem);
        }
      });
      await BuyerModelPerma.findByIdAndUpdate(user._id, {
        $set: { sessions: [session._id] },
      });
    }
    const response = new Custom_response(
      true,
      null,
      'loggedOutSuccessfully',
      'success',
      200,
      null
    );
    res.status(response.statusCode).json(response);
  }
);
export { logoutFromAllDevices };
