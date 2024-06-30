import {
  Custom_error,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { SellerModelTemp } from '../../../../../../models/seller/schema/sellerTemp';
import { SellerModelPerma } from '../../../../../../models/seller/schema/sellerPerma';
import { accountType } from '../../../../../../types/types';
const validateRequest: sync_middleware_type = async_error_handler(
  async (req, res, next) => {
    const {
      name,
      email,
      phoneNumber,
      address,
      password,
      accountInfo,
      bankAccount,
    } = req.body;
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
    if (
      !address ||
      !address.houseNumber ||
      !address.street ||
      !address.city ||
      !address.pincode
    )
      throw new Custom_error({
        errors: [{ message: 'sendCompleteAddress' }],
        statusCode: 400,
      });
    const existingUserPhoneTemp = await SellerModelTemp.findOne({
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
    const existingUserEmailTemp = await SellerModelTemp.findOne({
      email,
    });
    if (existingUserEmailTemp) {
      if (
        new Date(existingUserEmailTemp.emailOtp.expiresAt!) >
        new Date(Date.now())
      ) {
        throw new Custom_error({
          errors: [{ message: 'userWithThisPhoneAlreadyExit' }],
          statusCode: 400,
        });
      } else {
        state.isEmailActive = false;
        console.log('Email');
      }
    }
    if (!state.isEmailActive && !state.isPhoneActive)
      await SellerModelTemp.deleteOne({ email });
    const existingUserEmailPerma = await SellerModelPerma.findOne({ email });
    const existingUserPhonePerma = await SellerModelPerma.findOne({
      phoneNumber,
    });
    if (existingUserPhonePerma)
      throw new Custom_error({
        errors: [{ message: 'userAlreadyExist' }],
        statusCode: 400,
      });
    if (existingUserEmailPerma)
      throw new Custom_error({
        errors: [{ message: 'userAlreadyExist' }],
        statusCode: 400,
      });
    if (!accountInfo)
      throw new Custom_error({
        errors: [{ message: 'accountInfoRequired' }],
        statusCode: 400,
      });
    if (!accountInfo.accountType)
      throw new Custom_error({
        errors: [{ message: 'accountTypeRequired' }],
        statusCode: 400,
      });
    if (
      accountInfo.accountType == accountType.BUSINESS &&
      (!accountInfo.shopName ||
        !accountInfo.outlet ||
        !accountInfo.GSTIN ||
        !accountInfo.businessRegistrationNumber)
    )
      throw new Custom_error({
        errors: [
          { message: 'accountInfoNotComplete' },
          {
            message: `These are the required fields for a business account
              !accountInfo.shopName ||
              !accountInfo.outlet ||
              !accountInfo.GSTIN ||
              !accountInfo.businessRegistrationNumber`,
          },
        ],
        statusCode: 400,
      });
    const sameGstNumberTemp = await SellerModelTemp.findOne({
      'accountInfo.GSTIN': accountInfo.GSTIN,
    });
    const sameBusinesssRegNoTemp = await SellerModelTemp.findOne({
      'accountInfo.businessRegistrationNumber':
        accountInfo.businessRegistrationNumber,
    });
    const sameGstNumberPerma = await SellerModelPerma.findOne({
      'accountInfo.GSTIN': accountInfo.GSTIN,
    });
    const sameBusinesssRegNoPerma = await SellerModelPerma.findOne({
      'accountInfo.businessRegistrationNumber':
        accountInfo.businessRegistrationNumber,
    });
    if (sameBusinesssRegNoPerma || sameBusinesssRegNoTemp)
      throw new Custom_error({
        errors: [{ message: 'businessRegNoAlreadyExist' }],
        statusCode: 400,
      });
    if (sameGstNumberPerma || sameGstNumberTemp)
      throw new Custom_error({
        errors: [{ message: 'GSTNoAlreadyExist' }],
        statusCode: 400,
      });
    if (!bankAccount)
      throw new Custom_error({
        errors: [{ message: 'bankInfoRequired' }],
        statusCode: 400,
      });
    if (
      !bankAccount.accountNumber ||
      !bankAccount.ifscCode ||
      !bankAccount.accountHolderName ||
      !bankAccount.bankName ||
      !bankAccount.branchName
    )
      throw new Custom_error({
        errors: [
          { message: 'bankAccountInfoNotComplete' },
          {
            message: `These are the required fields for bank account 
            !bankAccount.accountNumber ||
            !bankAccount.ifscCode ||
            !bankAccount.accountHolderName ||
            !bankAccount.bankName ||
            !bankAccount.branchName`,
          },
        ],
        statusCode: 400,
      });
    next();
  }
);
export { validateRequest };
