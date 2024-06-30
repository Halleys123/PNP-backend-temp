import {
  Custom_error,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { checkOtp } from '../../../../../../utils/otp/generateOtp';
import {
  requestWithTempAdmin,
  requestWithTempSeller,
} from '../../../../../../types/types';
import { SellerModelTemp } from '../../../../../../models/seller/schema/sellerTemp';
import { AdminModelTemp } from '../../../../../../models/admin/schema/adminTemp';
const verifyOtp: sync_middleware_type = async_error_handler(
  async (req: requestWithTempAdmin, res, next) => {
    const { otp } = req.body;
    if (!otp)
      throw new Custom_error({
        errors: [{ message: 'sendOtp' }],
        statusCode: 400,
      });
    const isOtpMatching = await checkOtp(otp, req.admin!.otp!);
    if (!isOtpMatching)
      throw new Custom_error({
        errors: [{ message: 'otpMismatch' }],
        statusCode: 401,
      });
    if (req.admin!.isExpired)
      throw new Custom_error({
        errors: [{ message: 'otpExpired' }],
        statusCode: 400,
      });

    next();
  }
);
export { verifyOtp };
