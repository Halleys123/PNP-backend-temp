import express from 'express';
import { validateRequest } from './signUpLogic/signUp/middlewares/validateRequest';
import { getDeviceInfo } from '../../middlewares/device/deviceInfo';
import { sellerSignUp } from './signUpLogic/signUp/signup';
import { attachTempSeller } from './signUpLogic/otpVerification/middlewares/attachTempUser';
import { verifyEmail } from './signUpLogic/otpVerification/middlewares/verifyEmail';
import { resendEmailOtp } from './signUpLogic/otpVerification/resendEmailOtp';
import { maintainSession } from './signUpLogic/otpVerification/maintainSession';
import { verifyPhone } from './signUpLogic/otpVerification/middlewares/verifyPhone';
import { resendPhoneOtp } from './signUpLogic/otpVerification/resendPhoneOtp';
import { login } from './logInOut/login';
import { logout } from './logInOut/logout';
import { logoutFromAllDevices } from './logInOut/logoutFromAllDevices';
import { attachSellerViaRefresh } from './middlewares/attachViaRefresh';
import { getNewAccessToken } from './getNewToken/getNewAccessToken';
import { attachPermaSeller } from './middlewares/attachPermaSeller';
import { validateProduct } from './Products/middlewares/validateProduct';
import { addProduct } from './Products/addProduct';
import { isLoggedIn } from './logInOut/isLoggedIn';
import { changePassword } from './passwords/changePassword/changePassword';
import { changePasswordLogout } from './passwords/middlewares/changePasswordLogout';
import { forgotPassword } from './passwords/forgotPassword/forgotPassword';
import { verifyForgotPasswordOtp } from './passwords/forgotPassword/verifyForgotPasswordOtp';
import { attachForgotPasswordSeller } from './passwords/forgotPassword/middlewares/attachForgotPassword';
import { resendForgotPasswordOtp } from './passwords/forgotPassword/resendForgotPasswordOtp';
import { changeForgotPassword } from './passwords/forgotPassword/changeForgotPassword';
import { getMyProducts } from './Products/getMyProducts';
import { getProductsSold } from './Products/productsSold';
import { topProducts } from './analytics/topProducts';
const router = express.Router();
router.route('/signup').post(validateRequest, getDeviceInfo, sellerSignUp);
router
  .route('/verifyEmail')
  .post(getDeviceInfo, attachTempSeller, verifyEmail, maintainSession);
router
  .route('/resendEmailOtp')
  .get(getDeviceInfo, attachTempSeller, resendEmailOtp);
router
  .route('/verifyPhone')
  .post(getDeviceInfo, attachTempSeller, verifyPhone, maintainSession);
router
  .route('/resendPhoneOtp')
  .get(getDeviceInfo, attachTempSeller, resendPhoneOtp);
router.route('/login').post(getDeviceInfo, login);
router.route('/logout').get(getDeviceInfo, attachSellerViaRefresh, logout);
router
  .route('/logoutFromAllDevices')
  .get(getDeviceInfo, attachSellerViaRefresh, logoutFromAllDevices);
router
  .route('/newAccessToken')
  .get(getDeviceInfo, attachSellerViaRefresh, getNewAccessToken);
router.route('/product').post(attachPermaSeller, validateProduct, addProduct);
router.route('/isLoggedIn').get(attachPermaSeller, isLoggedIn);

router
  .route('/changePassword')
  .post(attachPermaSeller, changePassword, changePasswordLogout);
router.route('/forgotPassword').post(getDeviceInfo, forgotPassword);
router
  .route('/verifyForgotPasswordOtp')
  .post(getDeviceInfo, attachForgotPasswordSeller, verifyForgotPasswordOtp);
router
  .route('/resendForgotPasswordOtp')
  .get(getDeviceInfo, attachForgotPasswordSeller, resendForgotPasswordOtp);
router
  .route('/changeForgotPassword')
  .post(getDeviceInfo, changeForgotPassword, changePasswordLogout);
router.route('/myProducts').get(attachPermaSeller, getMyProducts);
router.route('/soldProducts').get(attachPermaSeller, getProductsSold);
router.route('/topProducts').get(attachPermaSeller, topProducts);
export { router as sellerRouter };
