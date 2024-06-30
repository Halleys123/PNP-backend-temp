import express from "express";
import { validateRequest } from "./signUpLogic/signUp/middlewares/validateRequest";
import { getDeviceInfo } from "../../middlewares/device/deviceInfo";
import { adminSignUp } from "./signUpLogic/signUp/signup";
import { attachTempAdmin } from "./signUpLogic/otpVerification/middlewares/attachTempUser";
import { verifyOtp } from "./signUpLogic/otpVerification/middlewares/verifyOtp";
import { maintainSession } from "./signUpLogic/otpVerification/maintainSession";
import { resendOtp } from "./signUpLogic/otpVerification/resendOtp";
import { login } from "./logInOut/login";
import { attachAdminViaRefresh } from "./middlewares/attachViaRefresh";
import { logout } from "./logInOut/logout";
import { logoutFromAllDevices } from "./logInOut/logoutFromAllDevices";
import { isMainAdmin } from "./middlewares/isMainAdmin";
import { getUnverifiedAdmins } from "./unverifiedAdmins/getUnverifiedAdmins";
import { attachPermaAdmin } from "./middlewares/attachPermaAdmin";
import { verifyAdmin } from "./unverifiedAdmins/verifyAdmin";
import { getNewAccessToken } from "./getNewToken/getNewAccessToken";
import { getUnverifiedProducts } from "./products/getUnverifiedProducts";
import { verifyProduct } from "./products/verifyProduct";
import { getOrders } from "./analytics/getOrders";
import { getOrderById } from "./analytics/getOrderById";
import { topProductsList } from "./analytics/topProductsList";
import { topSellersList } from "./analytics/topSellersList";
const router = express.Router();
router.route("/signup").post(validateRequest, getDeviceInfo, adminSignUp);
router
  .route("/verifyOtp")
  .post(getDeviceInfo, attachTempAdmin, verifyOtp, maintainSession);
router.route("/resendOtp").get(getDeviceInfo, attachTempAdmin, resendOtp);

router.route("/login").post(getDeviceInfo, login);
router.route("/logout").get(getDeviceInfo, attachAdminViaRefresh, logout);
router
  .route("/logoutFromAllDevices")
  .get(getDeviceInfo, attachAdminViaRefresh, logoutFromAllDevices);
router
  .route("/unverifiedAdmins")
  .get(attachPermaAdmin, isMainAdmin, getUnverifiedAdmins);
router.route("/verifyAdmin").patch(attachPermaAdmin, isMainAdmin, verifyAdmin);
router
  .route("/newAccessToken")
  .get(getDeviceInfo, attachAdminViaRefresh, getNewAccessToken);
router
  .route("/unverifiedProducts")
  .get(attachPermaAdmin, getUnverifiedProducts);
router.route("/verifyProduct").patch(attachPermaAdmin, verifyProduct);
router.route("/orders").get(attachPermaAdmin, getOrders);
router.route("/orderById").get(attachPermaAdmin, getOrderById);
router.route("/topProductsList").get(attachPermaAdmin, topProductsList);
router.route("/topSellersList").get(attachPermaAdmin, topSellersList);
export { router as adminRouter };
