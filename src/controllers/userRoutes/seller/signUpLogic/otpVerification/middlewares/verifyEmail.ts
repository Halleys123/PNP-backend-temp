import {
  Custom_error,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { checkOtp } from '../../../../../../utils/otp/generateOtp';
import { requestWithTempSeller } from '../../../../../../types/types';
import { SellerModelTemp } from '../../../../../../models/seller/schema/sellerTemp';
const verifyEmail: sync_middleware_type = async_error_handler(
  async (req: requestWithTempSeller, res, next) => {
    const { otp } = req.body;
    if (!otp)
      throw new Custom_error({
        errors: [{ message: 'sendOtp' }],
        statusCode: 400,
      });
    const isOtpMatching = await checkOtp(otp, req.seller!.emailOtp.otp!);
    if (!isOtpMatching)
      throw new Custom_error({
        errors: [{ message: 'otpMismatch' }],
        statusCode: 401,
      });
    const { name, email, password, phoneNumber, address } = req.seller!;
    if (req.seller!.emailOtp.isExpired)
      throw new Custom_error({
        errors: [{ message: 'otpExpired' }],
        statusCode: 400,
      });
    const updatedUser = await SellerModelTemp.findOneAndUpdate(
      { email },
      { $set: { 'emailOtp.isVerified': true, 'emailOtp.isExpired': true } },
      { new: true }
    );
    req.seller = updatedUser!;
    next();
  }
);
export { verifyEmail };
