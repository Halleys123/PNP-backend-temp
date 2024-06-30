import {
  Custom_error,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { BuyerModelTemp } from '../../../../../../models/buyer/schema/buyerTemp';
import { BuyerModelPerma } from '../../../../../../models/buyer/schema/buyerPerma';
const validateRequest: sync_middleware_type = async_error_handler(
  async (req, res, next) => {
    const { name, email, phoneNumber, address, password } = req.body;
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

    const existingUserPhoneTemp = await BuyerModelTemp.findOne({
      phoneNumber,
    });
    const state = { isPhoneActive: true, isEmailActive: true };

    if (existingUserPhoneTemp) {
      if (
        new Date(existingUserPhoneTemp.phoneOtp.expiresAt!) >
        new Date(Date.now())
      ) {
        throw new Custom_error({
          errors: [{ message: 'userWithThisPhoneAlreadyExit' }],
          statusCode: 400,
        });
      } else {
        state.isPhoneActive = false;
        console.log('Phone');
      }
    }
    const existingUserEmailTemp = await BuyerModelTemp.findOne({
      email,
    });
    if (existingUserEmailTemp) {
      if (
        new Date(existingUserEmailTemp.emailOtp.expiresAt!) >
        new Date(Date.now())
      ) {
        throw new Custom_error({
          errors: [{ message: 'userWithThisEmailAlreadyExit' }],
          statusCode: 400,
        });
      } else {
        state.isEmailActive = false;
        console.log('Email');
      }
    }
    console.log(state);
    if (!state.isEmailActive) {
      if (
        new Date(existingUserEmailTemp?.phoneOtp.expiresAt!) >
        new Date(Date.now())
      )
        throw new Custom_error({
          errors: [{ message: 'userWithThisEmailAlreadyExit' }],
          statusCode: 400,
        });
      await BuyerModelTemp.deleteOne({ email });
    }
    if (!state.isPhoneActive) {
      if (
        new Date(existingUserPhoneTemp?.phoneOtp.expiresAt!) >
        new Date(Date.now())
      )
        throw new Custom_error({
          errors: [{ message: 'userWithThisPhoneAlreadyExit' }],
          statusCode: 400,
        });
      await BuyerModelTemp.deleteOne({ phoneNumber });
    }
    const existingUserEmailPerma = await BuyerModelPerma.findOne({ email });
    const existingUserPhonePerma = await BuyerModelPerma.findOne({
      phoneNumber,
    });
    if (existingUserPhonePerma)
      throw new Custom_error({
        errors: [{ message: 'userWithThisPhoneAlreadyExit' }],
        statusCode: 400,
      });
    if (existingUserEmailPerma)
      throw new Custom_error({
        errors: [{ message: 'userWithThisEmailAlreadyExit' }],
        statusCode: 400,
      });
    next();
  }
);
export { validateRequest };
