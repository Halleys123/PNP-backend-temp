import {
  Custom_error,
  async_error_handler,
  checkPasswords,
  jwtVerification,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import {
  requestWithPermaSeller,
  requestWithPermaSellerAndSession,
  roles,
} from '../../../../types/types';
import { SellerModelPerma } from '../../../../models/seller/schema/sellerPerma';
import { SessionModel } from '../../../../models/sessions/schema/sesssions';
interface DecodedToken {
  _id: string;
  role: roles;
}
const attachSellerViaRefresh: sync_middleware_type = async_error_handler(
  async (req: requestWithPermaSellerAndSession, res, next) => {
    const refreshToken = req.headers.authentication as string;
    if (!refreshToken)
      throw new Custom_error({
        errors: [{ message: 'sendTheRefreshToken' }],
        statusCode: 400,
      });
    if (!refreshToken.startsWith('Bearer'))
      throw new Custom_error({
        errors: [{ message: 'invalidToken' }],
        statusCode: 401,
      });
    const jwt = refreshToken.split(' ')[1];
    const decodedToken = (await jwtVerification(
      jwt,
      process.env.REFRESH_TOKEN_SECRET!
    )) as DecodedToken;
    const user = await SellerModelPerma.findById(decodedToken._id);
    if (!user)
      throw new Custom_error({
        errors: [{ message: 'noSuchUserFound' }],
        statusCode: 404,
      });
    const session = await SessionModel.findOne({ refreshToken: jwt });
    if (!session)
      throw new Custom_error({
        errors: [{ message: 'noSuchSessionActive' }],
        statusCode: 400,
      });
    const isFingerprintMatching = await checkPasswords(
      req.device?.deviceFingerprint!,
      session.deviceFingerprint
    );
    if (!isFingerprintMatching)
      throw new Custom_error({
        errors: [{ message: 'notAValidDevice' }],
        statusCode: 400,
      });
    req.session = session;
    req.seller = user;
    next();
  }
);
export { attachSellerViaRefresh };
