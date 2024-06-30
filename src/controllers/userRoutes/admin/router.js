"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRouter = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = require("./signUpLogic/signUp/middlewares/validateRequest");
const deviceInfo_1 = require("../../middlewares/device/deviceInfo");
const signup_1 = require("./signUpLogic/signUp/signup");
const attachTempUser_1 = require("./signUpLogic/otpVerification/middlewares/attachTempUser");
const verifyOtp_1 = require("./signUpLogic/otpVerification/middlewares/verifyOtp");
const maintainSession_1 = require("./signUpLogic/otpVerification/maintainSession");
const resendOtp_1 = require("./signUpLogic/otpVerification/resendOtp");
const login_1 = require("./logInOut/login");
const attachViaRefresh_1 = require("./middlewares/attachViaRefresh");
const logout_1 = require("./logInOut/logout");
const logoutFromAllDevices_1 = require("./logInOut/logoutFromAllDevices");
const isMainAdmin_1 = require("./middlewares/isMainAdmin");
const getUnverifiedAdmins_1 = require("./unverifiedAdmins/getUnverifiedAdmins");
const attachPermaAdmin_1 = require("./middlewares/attachPermaAdmin");
const verifyAdmin_1 = require("./unverifiedAdmins/verifyAdmin");
const getNewAccessToken_1 = require("./getNewToken/getNewAccessToken");
const getUnverifiedProducts_1 = require("./products/getUnverifiedProducts");
const verifyProduct_1 = require("./products/verifyProduct");
const getOrders_1 = require("./analytics/getOrders");
const getOrderById_1 = require("./analytics/getOrderById");
const topProductsList_1 = require("./analytics/topProductsList");
const topSellersList_1 = require("./analytics/topSellersList");
const router = express_1.default.Router();
exports.adminRouter = router;
router.route("/signup").post(validateRequest_1.validateRequest, deviceInfo_1.getDeviceInfo, signup_1.adminSignUp);
router
    .route("/verifyOtp")
    .post(deviceInfo_1.getDeviceInfo, attachTempUser_1.attachTempAdmin, verifyOtp_1.verifyOtp, maintainSession_1.maintainSession);
router.route("/resendOtp").get(deviceInfo_1.getDeviceInfo, attachTempUser_1.attachTempAdmin, resendOtp_1.resendOtp);
router.route("/login").post(deviceInfo_1.getDeviceInfo, login_1.login);
router.route("/logout").get(deviceInfo_1.getDeviceInfo, attachViaRefresh_1.attachAdminViaRefresh, logout_1.logout);
router
    .route("/logoutFromAllDevices")
    .get(deviceInfo_1.getDeviceInfo, attachViaRefresh_1.attachAdminViaRefresh, logoutFromAllDevices_1.logoutFromAllDevices);
router
    .route("/unverifiedAdmins")
    .get(attachPermaAdmin_1.attachPermaAdmin, isMainAdmin_1.isMainAdmin, getUnverifiedAdmins_1.getUnverifiedAdmins);
router.route("/verifyAdmin").patch(attachPermaAdmin_1.attachPermaAdmin, isMainAdmin_1.isMainAdmin, verifyAdmin_1.verifyAdmin);
router
    .route("/newAccessToken")
    .get(deviceInfo_1.getDeviceInfo, attachViaRefresh_1.attachAdminViaRefresh, getNewAccessToken_1.getNewAccessToken);
router
    .route("/unverifiedProducts")
    .get(attachPermaAdmin_1.attachPermaAdmin, getUnverifiedProducts_1.getUnverifiedProducts);
router.route("/verifyProduct").patch(attachPermaAdmin_1.attachPermaAdmin, verifyProduct_1.verifyProduct);
router.route("/orders").get(attachPermaAdmin_1.attachPermaAdmin, getOrders_1.getOrders);
router.route("/orderById").get(attachPermaAdmin_1.attachPermaAdmin, getOrderById_1.getOrderById);
router.route("/topProductsList").get(attachPermaAdmin_1.attachPermaAdmin, topProductsList_1.topProductsList);
router.route("/topSellersList").get(attachPermaAdmin_1.attachPermaAdmin, topSellersList_1.topSellersList);
