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
exports.verifyOtp = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const generateOtp_1 = require("../../../../../../utils/otp/generateOtp");
const verifyOtp = (0, utils_1.async_error_handler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { otp } = req.body;
    if (!otp)
        throw new utils_1.Custom_error({
            errors: [{ message: 'sendOtp' }],
            statusCode: 400,
        });
    const isOtpMatching = yield (0, generateOtp_1.checkOtp)(otp, req.admin.otp);
    if (!isOtpMatching)
        throw new utils_1.Custom_error({
            errors: [{ message: 'otpMismatch' }],
            statusCode: 401,
        });
    if (req.admin.isExpired)
        throw new utils_1.Custom_error({
            errors: [{ message: 'otpExpired' }],
            statusCode: 400,
        });
    next();
}));
exports.verifyOtp = verifyOtp;