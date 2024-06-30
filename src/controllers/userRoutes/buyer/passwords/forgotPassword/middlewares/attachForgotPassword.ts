import {
  Custom_error,
  async_error_handler,
  checkPasswords,
  jwtVerification,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { requestWithForgotPasswordBuyer } from '../../../../../../types/types';
import { BuyerForgotPasswordTempModel } from '../../../../../../models/buyer/schema/buyerForgotPasswordTemp';
interface decodedToken {
  _id: string;
}
const attachForgotPasswordBuyer: sync_middleware_type = async_error_handler(
  async (req: requestWithForgotPasswordBuyer, res, next) => {
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
      process.env.FORGOT_PASSWORD_OTP_SECRET!
    )) as decodedToken;
    const foundUser = await BuyerForgotPasswordTempModel.findById(
      tokenInfo._id
    );
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
        errors: [{ message: 'initiatedForgotPasswordFromSomeOtherDevice' }],
        statusCode: 401,
      });
    req.forgotPasswordBuyer = foundUser;
    next();
  }
);
export { attachForgotPasswordBuyer };
