"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPhone = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const generateOtp_1 = require("../../../../../../utils/otp/generateOtp");
const sellerTemp_1 = require("../../../../../../models/seller/schema/sellerTemp");
const verifyPhone = (0, utils_1.async_error_handler)(async (req, res, next) => {
    const { otp } = req.body;
    if (!otp)
        throw new utils_1.Custom_error({
            errors: [{ message: 'sendOtp' }],
            statusCode: 400,
        });
    const isOtpMatching = await (0, generateOtp_1.checkOtp)(otp, req.seller.phoneOtp.otp);
    if (!isOtpMatching)
        throw new utils_1.Custom_error({
            errors: [{ message: 'otpMismatch' }],
            statusCode: 401,
        });
    const { name, email, password, phoneNumber, address } = req.seller;
    if (req.seller.phoneOtp.isExpired)
        throw new utils_1.Custom_error({
            errors: [{ message: 'otpExpired' }],
            statusCode: 400,
        });
    const updatedUser = await sellerTemp_1.SellerModelTemp.findOneAndUpdate({ phoneNumber }, { $set: { 'phoneOtp.isVerified': true, 'phoneOtp.isExpired': true } }, { new: true });
    req.seller = updatedUser;
    next();
});
exports.verifyPhone = verifyPhone;
