import {
  Custom_error,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { AdminModelTemp } from '../../../../../../models/admin/schema/adminTemp';
import { AdminType } from '../../../../../../models/admin/utils/common';
import { AdminModelPerma } from '../../../../../../models/admin/schema/adminPerma';
const validateRequest: sync_middleware_type = async_error_handler(
  async (req, res, next) => {
    const { name, email, phoneNumber, password, designation } = req.body;
    if (designation == AdminType.MAIN_ADMIN) {
      const mainAdmin = await AdminModelPerma.findOne({
        designation: AdminType.MAIN_ADMIN,
      });
      if (mainAdmin)
        throw new Custom_error({
          errors: [{ message: 'mainAdminAlreadyExists' }],
          statusCode: 400,
        });
    }
    if (!name)
      throw new Custom_error({
        errors: [{ message: 'sendName' }],
        statusCode: 400,
      });
    if (!email)
      throw new Custom_error({
        errors: [{ message: 'sendEmail' }],
        statusCode: 400,
      });
    if (!password)
      throw new Custom_error({
        errors: [{ message: 'sendPassword' }],
        statusCode: 400,
      });
    if (!phoneNumber)
      throw new Custom_error({
        errors: [{ message: 'sendPhoneNumber' }],
        statusCode: 400,
      });
    if (!designation)
      throw new Custom_error({
        errors: [{ message: 'sendDesignation' }],
        statusCode: 400,
      });
    const existingUserPhoneTemp = await AdminModelTemp.findOne({
      phoneNumber,
    });
    if (existingUserPhoneTemp) {
      if (new Date(existingUserPhoneTemp?.expiresAt!) > new Date(Date.now())) {
        throw new Custom_error({
          errors: [{ message: 'adminWithThisPhoneAleadyExists' }],
          statusCode: 400,
        });
      } else await AdminModelTemp.findByIdAndDelete(existingUserPhoneTemp._id);
    }
    const existingUserEmailTemp = await AdminModelTemp.findOne({
      email,
    });
    if (existingUserEmailTemp) {
      if (new Date(existingUserEmailTemp?.expiresAt!) > new Date(Date.now()))
        throw new Custom_error({
          errors: [{ message: 'adminWithThisEmailAleadyExists' }],
          statusCode: 400,
        });
      else await AdminModelTemp.findByIdAndDelete(existingUserEmailTemp._id);
    }
    const existingUserEmailPerma = await AdminModelPerma.findOne({ email });
    if (existingUserEmailPerma)
      throw new Custom_error({
        errors: [{ message: 'adminWithThisEmailAleadyExists' }],
        statusCode: 400,
      });
    const existingUserPhonePerma = await AdminModelPerma.findOne({
      phoneNumber,
    });
    if (existingUserPhonePerma)
      throw new Custom_error({
        errors: [{ message: 'adminWithThisPhoneAleadyExists' }],
        statusCode: 400,
      });
    next();
  }
);
export { validateRequest };
