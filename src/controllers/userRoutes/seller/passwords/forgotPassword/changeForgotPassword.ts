import {
  Custom_error,
  Custom_response,
  async_error_handler,
  checkPasswords,
  hashPassword,
  jwtVerification,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { SellerForgotPasswordTempModel } from '../../../../../models/seller/schema/sellerForgotPasswordTemp';
import {
  requestWithDeviceFingerprint,
  requestWithForgotPasswordSeller,
} from '../../../../../types/types';
import { SellerModelPerma } from '../../../../../models/seller/schema/sellerPerma';

const changeForgotPassword: sync_middleware_type = async_error_handler(
  async (req: requestWithForgotPasswordSeller, res, next) => {
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
      process.env.CHANGE_PASSWORD_SECRET!
    )) as { _id: string };
    const foundUser = await SellerForgotPasswordTempModel.findById(
      tokenInfo._id
    );
    if (!foundUser)
      throw new Custom_error({
        errors: [{ message: 'noSuchUser' }],
        statusCode: 404,
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
    const { newPassword } = req.body;
    if (!newPassword)
      throw new Custom_error({
        errors: [{ message: 'sendANewPassword' }],
        statusCode: 400,
      });
    const seller = await SellerModelPerma.findByIdAndUpdate(
      foundUser.sellerId,
      {
        $set: { password: await hashPassword(newPassword) },
      }
    );
    await SellerForgotPasswordTempModel.findByIdAndDelete(foundUser._id);
    req.seller = seller!;
    next();
  }
);
export { changeForgotPassword };
