"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buyerRouter = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = require("./signUpLogic/signUp/middlewares/validateRequest");
const deviceInfo_1 = require("../../middlewares/device/deviceInfo");
const signup_1 = require("./signUpLogic/signUp/signup");
const attachTempUser_1 = require("./signUpLogic/otpVerification/middlewares/attachTempUser");
const verifyEmail_1 = require("./signUpLogic/otpVerification/middlewares/verifyEmail");
const resendEmailOtp_1 = require("./signUpLogic/otpVerification/resendEmailOtp");
const maintainSession_1 = require("./signUpLogic/otpVerification/maintainSession");
const verifyPhone_1 = require("./signUpLogic/otpVerification/middlewares/verifyPhone");
const resendPhoneOtp_1 = require("./signUpLogic/otpVerification/resendPhoneOtp");
const login_1 = require("./logInOut/login");
const logout_1 = require("./logInOut/logout");
const logoutFromAllDevices_1 = require("./logInOut/logoutFromAllDevices");
const attachViaRefresh_1 = require("./middlewares/attachViaRefresh");
const getNewAccessToken_1 = require("./getNewToken/getNewAccessToken");
const orderId_1 = require("./buy/orderId");
const verify_1 = require("./buy/verify");
const addProduct_1 = require("./cart/addProduct");
const removeProduct_1 = require("./cart/removeProduct");
const getCartDetail_1 = require("./cart/getCartDetail");
const attachPermaBuyer_1 = require("./middlewares/attachPermaBuyer");
const buy_1 = require("./buy/buy");
const attachOrder_1 = require("./buy/middlewares/attachOrder");
const isLoggedIn_1 = require("./logInOut/isLoggedIn");
const addAddress_1 = require("./address/addAddress");
const cashOnDelivery_1 = require("./buy/cashOnDelivery");
const onlinePayment_1 = require("./buy/onlinePayment");
const changePassword_1 = require("./passwords/changePassword/changePassword");
const changePasswordLogout_1 = require("./passwords/middlewares/changePasswordLogout");
const forgotPassword_1 = require("./passwords/forgotPassword/forgotPassword");
const attachForgotPassword_1 = require("./passwords/forgotPassword/middlewares/attachForgotPassword");
const verifyForgotPasswordOtp_1 = require("./passwords/forgotPassword/verifyForgotPasswordOtp");
const resendForgotPasswordOtp_1 = require("./passwords/forgotPassword/resendForgotPasswordOtp");
const changeForgotPassword_1 = require("./passwords/forgotPassword/changeForgotPassword");
const getProducts_1 = require("./products/getProducts");
const getProductById_1 = require("./products/getProductById");
const getMyOrders_1 = require("./orders/getMyOrders");
const router = express_1.default.Router();
exports.buyerRouter = router;
router.route('/signup').post(validateRequest_1.validateRequest, deviceInfo_1.getDeviceInfo, signup_1.buyerSignUp);
router
    .route('/verifyEmail')
    .post(deviceInfo_1.getDeviceInfo, attachTempUser_1.attachTempBuyer, verifyEmail_1.verifyEmail, maintainSession_1.maintainSession);
router
    .route('/resendEmailOtp')
    .get(deviceInfo_1.getDeviceInfo, attachTempUser_1.attachTempBuyer, resendEmailOtp_1.resendEmailOtp);
router
    .route('/verifyPhone')
    .post(deviceInfo_1.getDeviceInfo, attachTempUser_1.attachTempBuyer, verifyPhone_1.verifyPhone, maintainSession_1.maintainSession);
router
    .route('/resendPhoneOtp')
    .get(deviceInfo_1.getDeviceInfo, attachTempUser_1.attachTempBuyer, resendPhoneOtp_1.resendPhoneOtp);
router.route('/login').post(deviceInfo_1.getDeviceInfo, login_1.login);
router.route('/logout').get(deviceInfo_1.getDeviceInfo, attachViaRefresh_1.attachBuyerViaRefresh, logout_1.logout);
router
    .route('/logoutFromAllDevices')
    .get(deviceInfo_1.getDeviceInfo, attachViaRefresh_1.attachBuyerViaRefresh, logoutFromAllDevices_1.logoutFromAllDevices);
router
    .route('/newAccessToken')
    .get(deviceInfo_1.getDeviceInfo, attachViaRefresh_1.attachBuyerViaRefresh, getNewAccessToken_1.getNewAccessToken);
router
    .route('/create/orderId')
    .post(attachPermaBuyer_1.attachPermaBuyer, attachOrder_1.attachOrder, orderId_1.createOrderId);
router
    .route('/verifySignature')
    .post(attachPermaBuyer_1.attachPermaBuyer, attachOrder_1.attachOrder, verify_1.verifySignature);
router.route('/cart').post(attachPermaBuyer_1.attachPermaBuyer, addProduct_1.addProduct);
router.route('/cart').delete(attachPermaBuyer_1.attachPermaBuyer, removeProduct_1.removeProduct);
router.route('/cart').get(attachPermaBuyer_1.attachPermaBuyer, getCartDetail_1.getCartDetails);
router.route('/buy').post(attachPermaBuyer_1.attachPermaBuyer, buy_1.buy);
router
    .route('/cashOnDelivery')
    .get(attachPermaBuyer_1.attachPermaBuyer, attachOrder_1.attachOrder, cashOnDelivery_1.cashOnDelivery);
router
    .route('/onlinePayment')
    .get(attachPermaBuyer_1.attachPermaBuyer, attachOrder_1.attachOrder, onlinePayment_1.onlinePayment);
router.route('/isLoggedIn').get(attachPermaBuyer_1.attachPermaBuyer, isLoggedIn_1.isLoggedIn);
router.route('/addAddress').post(attachPermaBuyer_1.attachPermaBuyer, addAddress_1.addAddress);
router
    .route('/changePassword')
    .post(attachPermaBuyer_1.attachPermaBuyer, changePassword_1.changePassword, changePasswordLogout_1.changePasswordLogout);
router.route('/forgotPassword').post(deviceInfo_1.getDeviceInfo, forgotPassword_1.forgotPassword);
router
    .route('/verifyForgotPasswordOtp')
    .post(deviceInfo_1.getDeviceInfo, attachForgotPassword_1.attachForgotPasswordBuyer, verifyForgotPasswordOtp_1.verifyForgotPasswordOtp);
router
    .route('/resendForgotPasswordOtp')
    .get(deviceInfo_1.getDeviceInfo, attachForgotPassword_1.attachForgotPasswordBuyer, resendForgotPasswordOtp_1.resendForgotPasswordOtp);
router
    .route('/changeForgotPassword')
    .post(deviceInfo_1.getDeviceInfo, changeForgotPassword_1.changeForgotPassword, changePasswordLogout_1.changePasswordLogout);
router.route('/products').get(getProducts_1.getProducts);
router.route('/productById').get(getProductById_1.getProductById);
router.route('/myOrders').get(attachPermaBuyer_1.attachPermaBuyer, getMyOrders_1.getMyOrders);
