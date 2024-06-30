import {
  Custom_error,
  async_error_handler,
  jwtVerification,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { SellerModelPerma } from '../../../../models/seller/schema/sellerPerma';
import { requestWithPermaSeller } from '../../../../types/types';

const attachPermaSeller: sync_middleware_type = async_error_handler(
  async (req: requestWithPermaSeller, res, next) => {
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
    const foundUser = await SellerModelPerma.findById(tokenInfo._id).select(
      '+password'
    );
    if (!foundUser)
      throw new Custom_error({
        errors: [{ message: 'noSuchUser' }],
        statusCode: 404,
      });
    req.seller = foundUser;
    next();
  }
);
export { attachPermaSeller };
