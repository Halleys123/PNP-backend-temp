import {
  Custom_error,
  async_error_handler,
  jwtVerification,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { AdminModelPerma } from '../../../../models/admin/schema/adminPerma';
import { requestWithPermaAdmin } from '../../../../types/types';
import { AdminType } from '../../../../models/admin/utils/common';

const attachPermaAdmin: sync_middleware_type = async_error_handler(
  async (req: requestWithPermaAdmin, res, next) => {
    interface decodedToken {
      _id: string;
      role: string;
    }
    const jwt: string = req.headers.authentication as string;
    if (!jwt)
      throw new Custom_error({
        errors: [{ message: 'noJwt' }],
        statusCode: 400,
      });
    if (!jwt.startsWith('Bearer'))
      throw new Custom_error({
        errors: [{ message: 'invalidToken' }],
        statusCode: 401,
      });
    const token: string = jwt.split(' ')[1];
    const tokenInfo = (await jwtVerification(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    )) as decodedToken;
    const foundUser = await AdminModelPerma.findById(tokenInfo._id);
    if (!foundUser)
      throw new Custom_error({
        errors: [{ message: 'noSuchUser' }],
        statusCode: 404,
      });
    if (
      foundUser.designation != AdminType.MAIN_ADMIN &&
      !foundUser.isVerifiedByMainAdmin
    )
      throw new Custom_error({
        errors: [{ message: 'getYourselfVerifiedByAdmin' }],
        statusCode: 401,
      });

    req.admin = foundUser;
    next();
  }
);
export { attachPermaAdmin };