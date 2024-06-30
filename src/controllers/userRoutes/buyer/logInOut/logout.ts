import {
  Custom_error,
  Custom_response,
  async_error_handler,
  jwtVerification,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import {
  SessionDoc,
  SessionModel,
} from '../../../../models/sessions/schema/sesssions';
import {
  requestWithPermaBuyerAndSession,
  roles,
} from '../../../../types/types';
import {
  BuyerDocPerma,
  BuyerModelPerma,
} from '../../../../models/buyer/schema/buyerPerma';
const logout: sync_middleware_type = async_error_handler(
  async (req: requestWithPermaBuyerAndSession, res, next) => {
    const session = req.session as SessionDoc;
    const user = req.buyer as BuyerDocPerma;
    await BuyerModelPerma.findByIdAndUpdate(user._id, {
      $pull: { sessions: session._id },
    });
    await SessionModel.findByIdAndDelete(session._id);
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
export { logout };