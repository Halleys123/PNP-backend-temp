"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachForgotPasswordSeller = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const sellerForgotPasswordTemp_1 = require("../../../../../../models/seller/schema/sellerForgotPasswordTemp");
const attachForgotPasswordSeller = (0, utils_1.async_error_handler)(async (req, res, next) => {
    console.log(req.headers);
    const jwt = req.headers.authentication;
    if (!jwt)
        throw new utils_1.Custom_error({
            errors: [{ message: 'noJwt' }],
            statusCode: 400,
        });
    if (!jwt.startsWith('Bearer'))
        throw new utils_1.Custom_error({
            errors: [{ message: 'invalidToken' }],
            statusCode: 401,
        });
    const token = jwt.split(' ')[1];
    const tokenInfo = (await (0, utils_1.jwtVerification)(token, process.env.FORGOT_PASSWORD_OTP_SECRET));
    const foundUser = await sellerForgotPasswordTemp_1.SellerForgotPasswordTempModel.findById(tokenInfo._id);
    if (!foundUser)
        throw new utils_1.Custom_error({
            errors: [{ message: 'noSuchUser' }],
            statusCode: 404,
        });
    if (foundUser.otpJwt != token)
        throw new utils_1.Custom_error({
            errors: [{ message: 'forgedJwt' }],
            statusCode: 401,
        });
    const matchedFingerprint = await (0, utils_1.checkPasswords)(req.device.deviceFingerprint, foundUser.deviceFingerprint);
    if (!matchedFingerprint)
        throw new utils_1.Custom_error({
            errors: [{ message: 'initiatedForgotPasswordFromSomeOtherDevice' }],
            statusCode: 401,
        });
    req.forgotPasswordSeller = foundUser;
    next();
});
exports.attachForgotPasswordSeller = attachForgotPasswordSeller;
