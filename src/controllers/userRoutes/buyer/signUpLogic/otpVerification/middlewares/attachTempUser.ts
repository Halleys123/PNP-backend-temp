import {
  Custom_error,
  async_error_handler,
  checkPasswords,
  jwtVerification,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { requestWithTempBuyer } from '../../../../../../types/types';
import { BuyerModelTemp } from '../../../../../../models/buyer/schema/buyerTemp';

const attachTempBuyer: sync_middleware_type = async_error_handler(
  async (req: requestWithTempBuyer, res, next) => {
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
      process.env.JWT_SIGNUP_OTP_SECRET!
    )) as decodedToken;
    const foundUser = await BuyerModelTemp.findById(tokenInfo._id);
    if (!foundUser)
      throw new Custom_error({
        errors: [{ message: 'noSuchUser' }],
        statusCode: 404,
      });
    if (foundUser.otpJwt != token)
      throw new Custom_error({
        errors: [{ message: 'forgedJwt' }],
        statusCode: 401,
      });
    const matchedFingerprint = await checkPasswords(
      req.device!.deviceFingerprint!,
      foundUser.deviceFingerprint
    );
    if (!matchedFingerprint)
      throw new Custom_error({
        errors: [{ message: 'initiatedSignUpFromSomeOtherDevice' }],
        statusCode: 401,
      });
    req.buyer = foundUser;
    next();
  }
);
export { attachTempBuyer };
