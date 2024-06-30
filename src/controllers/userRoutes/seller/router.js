"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sellerRouter = void 0;
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
const attachPermaSeller_1 = require("./middlewares/attachPermaSeller");
const validateProduct_1 = require("./Products/middlewares/validateProduct");
const addProduct_1 = require("./Products/addProduct");
const isLoggedIn_1 = require("./logInOut/isLoggedIn");
const changePassword_1 = require("./passwords/changePassword/changePassword");
const changePasswordLogout_1 = require("./passwords/middlewares/changePasswordLogout");
const forgotPassword_1 = require("./passwords/forgotPassword/forgotPassword");
const verifyForgotPasswordOtp_1 = require("./passwords/forgotPassword/verifyForgotPasswordOtp");
const attachForgotPassword_1 = require("./passwords/forgotPassword/middlewares/attachForgotPassword");
const resendForgotPasswordOtp_1 = require("./passwords/forgotPassword/resendForgotPasswordOtp");
const changeForgotPassword_1 = require("./passwords/forgotPassword/changeForgotPassword");
const getMyProducts_1 = require("./Products/getMyProducts");
const productsSold_1 = require("./Products/productsSold");
const topProducts_1 = require("./analytics/topProducts");
const router = express_1.default.Router();
exports.sellerRouter = router;
router.route('/signup').post(validateRequest_1.validateRequest, deviceInfo_1.getDeviceInfo, signup_1.sellerSignUp);
router
    .route('/verifyEmail')
    .post(deviceInfo_1.getDeviceInfo, attachTempUser_1.attachTempSeller, verifyEmail_1.verifyEmail, maintainSession_1.maintainSession);
router
    .route('/resendEmailOtp')
    .get(deviceInfo_1.getDeviceInfo, attachTempUser_1.attachTempSeller, resendEmailOtp_1.resendEmailOtp);
router
    .route('/verifyPhone')
    .post(deviceInfo_1.getDeviceInfo, attachTempUser_1.attachTempSeller, verifyPhone_1.verifyPhone, maintainSession_1.maintainSession);
router
    .route('/resendPhoneOtp')
    .get(deviceInfo_1.getDeviceInfo, attachTempUser_1.attachTempSeller, resendPhoneOtp_1.resendPhoneOtp);
router.route('/login').post(deviceInfo_1.getDeviceInfo, login_1.login);
router.route('/logout').get(deviceInfo_1.getDeviceInfo, attachViaRefresh_1.attachSellerViaRefresh, logout_1.logout);
router
    .route('/logoutFromAllDevices')
    .get(deviceInfo_1.getDeviceInfo, attachViaRefresh_1.attachSellerViaRefresh, logoutFromAllDevices_1.logoutFromAllDevices);
router
    .route('/newAccessToken')
    .get(deviceInfo_1.getDeviceInfo, attachViaRefresh_1.attachSellerViaRefresh, getNewAccessToken_1.getNewAccessToken);
router.route('/product').post(attachPermaSeller_1.attachPermaSeller, validateProduct_1.validateProduct, addProduct_1.addProduct);
router.route('/isLoggedIn').get(attachPermaSeller_1.attachPermaSeller, isLoggedIn_1.isLoggedIn);
router
    .route('/changePassword')
    .post(attachPermaSeller_1.attachPermaSeller, changePassword_1.changePassword, changePasswordLogout_1.changePasswordLogout);
router.route('/forgotPassword').post(deviceInfo_1.getDeviceInfo, forgotPassword_1.forgotPassword);
router
    .route('/verifyForgotPasswordOtp')
    .post(deviceInfo_1.getDeviceInfo, attachForgotPassword_1.attachForgotPasswordSeller, verifyForgotPasswordOtp_1.verifyForgotPasswordOtp);
router
    .route('/resendForgotPasswordOtp')
    .get(deviceInfo_1.getDeviceInfo, attachForgotPassword_1.attachForgotPasswordSeller, resendForgotPasswordOtp_1.resendForgotPasswordOtp);
router
    .route('/changeForgotPassword')
    .post(deviceInfo_1.getDeviceInfo, changeForgotPassword_1.changeForgotPassword, changePasswordLogout_1.changePasswordLogout);
router.route('/myProducts').get(attachPermaSeller_1.attachPermaSeller, getMyProducts_1.getMyProducts);
router.route('/soldProducts').get(attachPermaSeller_1.attachPermaSeller, productsSold_1.getProductsSold);
router.route('/topProducts').get(attachPermaSeller_1.attachPermaSeller, topProducts_1.topProducts);
