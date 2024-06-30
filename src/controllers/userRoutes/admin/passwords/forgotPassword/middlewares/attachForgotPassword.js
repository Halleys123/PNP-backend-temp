"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachForgotPasswordAdmin = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const adminForgotPasswordTemp_1 = require("../../../../../../models/admin/schema/adminForgotPasswordTemp");
const attachForgotPasswordAdmin = (0, utils_1.async_error_handler)(async (req, res, next) => {
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
    const foundUser = await adminForgotPasswordTemp_1.AdminForgotPasswordTempModel.findById(tokenInfo._id);
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
    req.forgotPasswordAdmin = foundUser;
    next();
});
exports.attachForgotPasswordAdmin = attachForgotPasswordAdmin;
