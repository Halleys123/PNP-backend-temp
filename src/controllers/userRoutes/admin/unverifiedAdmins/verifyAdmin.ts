import {
  Custom_error,
  Custom_response,
  async_error_handler,
} from '@himanshu_guptaorg/utils';
import { AdminModelPerma } from '../../../../models/admin/schema/adminPerma';

const verifyAdmin = async_error_handler(async (req, res, next) => {
  const { adminToBeVerified, toVerify } = req.body;
  if (!adminToBeVerified)
    throw new Custom_error({
      errors: [{ message: 'giveMeTheAdminToBeVerified' }],
      statusCode: 400,
    });
  if (typeof toVerify != 'boolean')
    throw new Custom_error({
      errors: [{ message: 'theToVerifyMustBeABoolean' }],
      statusCode: 400,
    });
  if (toVerify)
    await AdminModelPerma.findByIdAndUpdate(adminToBeVerified, {
      $set: { isVerifiedByMainAdmin: true },
    });
  else await AdminModelPerma.findByIdAndDelete(adminToBeVerified);
  const response = new Custom_response(
    true,
    null,
    'updatedSuccesfully',
    'success',
    200,
    null
  );
  res.status(response.statusCode).json(response);
});
export { verifyAdmin };
