import {
  Custom_error,
  Custom_response,
  async_error_handler,
  jwtVerification,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import {
  AdminPermaDoc,
  AdminModelPerma,
} from '../../../../models/admin/schema/adminPerma';
import {
  SessionDoc,
  SessionModel,
} from '../../../../models/sessions/schema/sesssions';
import { requestWithPermaAdminAndSession } from '../../../../types/types';
const logoutFromAllDevices: sync_middleware_type = async_error_handler(
  async (req: requestWithPermaAdminAndSession, res, next) => {
    const logoutThisDevice = req.query.logoutThisDevice;
    const session = req.session as SessionDoc;
    const user = req.admin as AdminPermaDoc;
    if (logoutThisDevice == 'true') {
      user.sessions.forEach(async (elem) => {
        await SessionModel.findByIdAndDelete(elem);
      });
      await AdminModelPerma.findByIdAndUpdate(user._id, {
        $set: { sessions: [] },
      });
    } else {
      user.sessions.forEach(async (elem) => {
        if (JSON.stringify(session._id) != JSON.stringify(elem)) {
          await SessionModel.findByIdAndDelete(elem);
        }
      });
      await AdminModelPerma.findByIdAndUpdate(user._id, {
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
