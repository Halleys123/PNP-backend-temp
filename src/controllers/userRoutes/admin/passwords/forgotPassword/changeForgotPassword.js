"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeForgotPassword = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const adminForgotPasswordTemp_1 = require("../../../../../models/admin/schema/adminForgotPasswordTemp");
const adminPerma_1 = require("../../../../../models/admin/schema/adminPerma");
const changeForgotPassword = (0, utils_1.async_error_handler)(async (req, res, next) => {
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
    const tokenInfo = (await (0, utils_1.jwtVerification)(token, process.env.CHANGE_PASSWORD_SECRET));
    const foundUser = await adminForgotPasswordTemp_1.AdminForgotPasswordTempModel.findById(tokenInfo._id);
    if (!foundUser)
        throw new utils_1.Custom_error({
            errors: [{ message: 'noSuchUser' }],
            statusCode: 404,
        });
    const matchedFingerprint = await (0, utils_1.checkPasswords)(req.device.deviceFingerprint, foundUser.deviceFingerprint);
    if (!matchedFingerprint)
        throw new utils_1.Custom_error({
            errors: [{ message: 'initiatedSignUpFromSomeOtherDevice' }],
            statusCode: 401,
        });
    const { newPassword } = req.body;
    if (!newPassword)
        throw new utils_1.Custom_error({
            errors: [{ message: 'sendANewPassword' }],
            statusCode: 400,
        });
    const admin = await adminPerma_1.AdminModelPerma.findByIdAndUpdate(foundUser.adminId, {
        $set: { password: await (0, utils_1.hashPassword)(newPassword) },
    });
    await adminForgotPasswordTemp_1.AdminForgotPasswordTempModel.findByIdAndDelete(foundUser._id);
    req.admin = admin;
    next();
});
exports.changeForgotPassword = changeForgotPassword;
