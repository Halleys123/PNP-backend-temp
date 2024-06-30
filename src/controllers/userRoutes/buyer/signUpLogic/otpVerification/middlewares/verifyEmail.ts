import {
  Custom_error,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { checkOtp } from '../../../../../../utils/otp/generateOtp';
import { requestWithTempBuyer } from '../../../../../../types/types';
import { BuyerModelTemp } from '../../../../../../models/buyer/schema/buyerTemp';
const verifyEmail: sync_middleware_type = async_error_handler(
  async (req: requestWithTempBuyer, res, next) => {
    const { otp } = req.body;
    if (!otp)
      throw new Custom_error({
        errors: [{ message: 'sendOtp' }],
        statusCode: 400,
      });
    const isOtpMatching = await checkOtp(otp, req.buyer!.emailOtp.otp!);
    if (!isOtpMatching)
      throw new Custom_error({
        errors: [{ message: 'otpMismatch' }],
        statusCode: 401,
      });
    const { name, email, password, phoneNumber } = req.buyer!;
    if (req.buyer!.emailOtp.isExpired)
      throw new Custom_error({
        errors: [{ message: 'otpExpired' }],
        statusCode: 400,
      });
    const updatedUser = await BuyerModelTemp.findOneAndUpdate(
      { email },
      { $set: { 'emailOtp.isVerified': true, 'emailOtp.isExpired': true } },
      { new: true }
    );
    req.buyer = updatedUser!;
    next();
  }
);
export { verifyEmail };
