import express from 'express';
import { validateRequest } from './signUpLogic/signUp/middlewares/validateRequest';
import { getDeviceInfo } from '../../middlewares/device/deviceInfo';
import { buyerSignUp } from './signUpLogic/signUp/signup';
import { attachTempBuyer } from './signUpLogic/otpVerification/middlewares/attachTempUser';
import { verifyEmail } from './signUpLogic/otpVerification/middlewares/verifyEmail';
import { resendEmailOtp } from './signUpLogic/otpVerification/resendEmailOtp';
import { maintainSession } from './signUpLogic/otpVerification/maintainSession';
import { verifyPhone } from './signUpLogic/otpVerification/middlewares/verifyPhone';
import { resendPhoneOtp } from './signUpLogic/otpVerification/resendPhoneOtp';
import { login } from './logInOut/login';
import { logout } from './logInOut/logout';
import { logoutFromAllDevices } from './logInOut/logoutFromAllDevices';
import { attachBuyerViaRefresh } from './middlewares/attachViaRefresh';
import { getNewAccessToken } from './getNewToken/getNewAccessToken';
import { createOrderId } from './buy/orderId';
import { verifySignature } from './buy/verify';
import { addProduct } from './cart/addProduct';
import { removeProduct } from './cart/removeProduct';
import { getCartDetails } from './cart/getCartDetail';
import { attachPermaBuyer } from './middlewares/attachPermaBuyer';
import { buy } from './buy/buy';
import { attachOrder } from './buy/middlewares/attachOrder';
import { isLoggedIn } from './logInOut/isLoggedIn';
import { addAddress } from './address/addAddress';
import { cashOnDelivery } from './buy/cashOnDelivery';
import { onlinePayment } from './buy/onlinePayment';
import { changePassword } from './passwords/changePassword/changePassword';
import { changePasswordLogout } from './passwords/middlewares/changePasswordLogout';
import { forgotPassword } from './passwords/forgotPassword/forgotPassword';
import { attachForgotPasswordBuyer } from './passwords/forgotPassword/middlewares/attachForgotPassword';
import { verifyForgotPasswordOtp } from './passwords/forgotPassword/verifyForgotPasswordOtp';
import { resendForgotPasswordOtp } from './passwords/forgotPassword/resendForgotPasswordOtp';
import { changeForgotPassword } from './passwords/forgotPassword/changeForgotPassword';
import { getProducts } from './products/getProducts';
import { getProductById } from './products/getProductById';
import { getMyOrders } from './orders/getMyOrders';

const router = express.Router();

router.route('/signup').post(validateRequest, getDeviceInfo, buyerSignUp);
router
  .route('/verifyEmail')
  .post(getDeviceInfo, attachTempBuyer, verifyEmail, maintainSession);
router
  .route('/resendEmailOtp')
  .get(getDeviceInfo, attachTempBuyer, resendEmailOtp);
router
  .route('/verifyPhone')
  .post(getDeviceInfo, attachTempBuyer, verifyPhone, maintainSession);
router
  .route('/resendPhoneOtp')
  .get(getDeviceInfo, attachTempBuyer, resendPhoneOtp);
router.route('/login').post(getDeviceInfo, login);
router.route('/logout').get(getDeviceInfo, attachBuyerViaRefresh, logout);
router
  .route('/logoutFromAllDevices')
  .get(getDeviceInfo, attachBuyerViaRefresh, logoutFromAllDevices);
router
  .route('/newAccessToken')
  .get(getDeviceInfo, attachBuyerViaRefresh, getNewAccessToken);
router
  .route('/create/orderId')
  .post(attachPermaBuyer, attachOrder, createOrderId);
router
  .route('/verifySignature')
  .post(attachPermaBuyer, attachOrder, verifySignature);
router.route('/cart').post(attachPermaBuyer, addProduct);
router.route('/cart').delete(attachPermaBuyer, removeProduct);
router.route('/cart').get(attachPermaBuyer, getCartDetails);
router.route('/buy').post(attachPermaBuyer, buy);
router
  .route('/cashOnDelivery')
  .get(attachPermaBuyer, attachOrder, cashOnDelivery);
router
  .route('/onlinePayment')
  .get(attachPermaBuyer, attachOrder, onlinePayment);
router.route('/isLoggedIn').get(attachPermaBuyer, isLoggedIn);
router.route('/addAddress').post(attachPermaBuyer, addAddress);
router
  .route('/changePassword')
  .post(attachPermaBuyer, changePassword, changePasswordLogout);
router.route('/forgotPassword').post(getDeviceInfo, forgotPassword);
router
  .route('/verifyForgotPasswordOtp')
  .post(getDeviceInfo, attachForgotPasswordBuyer, verifyForgotPasswordOtp);
router
  .route('/resendForgotPasswordOtp')
  .get(getDeviceInfo, attachForgotPasswordBuyer, resendForgotPasswordOtp);
router
  .route('/changeForgotPassword')
  .post(getDeviceInfo, changeForgotPassword, changePasswordLogout);
router.route('/products').get(getProducts);
router.route('/productById').get(getProductById);
router.route('/myOrders').get(attachPermaBuyer, getMyOrders);
export { router as buyerRouter };
