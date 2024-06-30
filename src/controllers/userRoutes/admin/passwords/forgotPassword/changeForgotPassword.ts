import {
  Custom_error,
  Custom_response,
  async_error_handler,
  checkPasswords,
  hashPassword,
  jwtVerification,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { AdminForgotPasswordTempModel } from '../../../../../models/admin/schema/adminForgotPasswordTemp';
import {
  requestWithDeviceFingerprint,
  requestWithForgotPasswordAdmin,
} from '../../../../../types/types';
import { AdminModelPerma } from '../../../../../models/admin/schema/adminPerma';

const changeForgotPassword: sync_middleware_type = async_error_handler(
  async (req: requestWithForgotPasswordAdmin, res, next) => {
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
    const foundUser = await AdminForgotPasswordTempModel.findById(
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
    const admin = await AdminModelPerma.findByIdAndUpdate(foundUser.adminId, {
      $set: { password: await hashPassword(newPassword) },
    });
    await AdminForgotPasswordTempModel.findByIdAndDelete(foundUser._id);
    req.admin = admin!;
    next();
  }
);
export { changeForgotPassword };
