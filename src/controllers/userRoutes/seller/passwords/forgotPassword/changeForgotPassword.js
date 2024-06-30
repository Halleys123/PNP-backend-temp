"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeForgotPassword = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const sellerForgotPasswordTemp_1 = require("../../../../../models/seller/schema/sellerForgotPasswordTemp");
const sellerPerma_1 = require("../../../../../models/seller/schema/sellerPerma");
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
    const foundUser = await sellerForgotPasswordTemp_1.SellerForgotPasswordTempModel.findById(tokenInfo._id);
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
    const seller = await sellerPerma_1.SellerModelPerma.findByIdAndUpdate(foundUser.sellerId, {
        $set: { password: await (0, utils_1.hashPassword)(newPassword) },
    });
    await sellerForgotPasswordTemp_1.SellerForgotPasswordTempModel.findByIdAndDelete(foundUser._id);
    req.seller = seller;
    next();
});
exports.changeForgotPassword = changeForgotPassword;
