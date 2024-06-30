import {
  Custom_error,
  async_error_handler,
  jwtVerification,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { requestWithPermaBuyer } from '../../../../types/types';
import { BuyerModelPerma } from '../../../../models/buyer/schema/buyerPerma';
const attachPermaBuyer: sync_middleware_type = async_error_handler(
  async (req: requestWithPermaBuyer, res, next) => {
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
    const foundUser = await BuyerModelPerma.findById(tokenInfo._id);
    if (!foundUser)
      throw new Custom_error({
        errors: [{ message: 'noSuchUser' }],
        statusCode: 404,
      });
    req.buyer = foundUser;
    next();
  }
);
export { attachPermaBuyer };
