"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyForgotPasswordOtp = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const generateOtp_1 = require("../../../../../utils/otp/generateOtp");
const adminForgotPasswordTemp_1 = require("../../../../../models/admin/schema/adminForgotPasswordTemp");
const verifyForgotPasswordOtp = (0, utils_1.async_error_handler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { otp } = req.body;
    if (!otp)
        throw new utils_1.Custom_error({
            errors: [{ message: 'noOtpSent' }],
            statusCode: 400,
        });
    if (req.forgotPasswordAdmin.isExpired)
        throw new utils_1.Custom_error({
            errors: [{ message: 'otpExpired' }],
            statusCode: 401,
        });
    if (!(yield (0, generateOtp_1.checkOtp)(otp, req.forgotPasswordAdmin.otp))) {
        throw new utils_1.Custom_error({
            errors: [{ message: 'otpMismatch' }],
            statusCode: 400,
        });
    }
    const changePasswordJwt = yield (0, utils_1.createJwt)({
        payload: { _id: req.forgotPasswordAdmin._id },
        options: { expiresIn: process.env.MAX_PASSWORD_CHANGE_TIME },
    }, process.env.CHANGE_PASSWORD_SECRET);
    yield adminForgotPasswordTemp_1.AdminForgotPasswordTempModel.findByIdAndUpdate(req.forgotPasswordAdmin._id, {
        $set: {
            isExpired: true,
        },
    });
    const response = new utils_1.Custom_response(true, null, { token: changePasswordJwt }, 'success', 200, null);
    res.status(response.statusCode).json(response);
}));
exports.verifyForgotPasswordOtp = verifyForgotPasswordOtp;
