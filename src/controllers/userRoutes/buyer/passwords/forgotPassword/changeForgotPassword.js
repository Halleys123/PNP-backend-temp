"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeForgotPassword = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const buyerForgotPasswordTemp_1 = require("../../../../../models/buyer/schema/buyerForgotPasswordTemp");
const buyerPerma_1 = require("../../../../../models/buyer/schema/buyerPerma");
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
    const foundUser = await buyerForgotPasswordTemp_1.BuyerForgotPasswordTempModel.findById(tokenInfo._id);
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
    const buyer = await buyerPerma_1.BuyerModelPerma.findByIdAndUpdate(foundUser.buyerId, {
        $set: { password: await (0, utils_1.hashPassword)(newPassword) },
    });
    console.log(req.forgotPasswordBuyer);
    await buyerForgotPasswordTemp_1.BuyerForgotPasswordTempModel.findByIdAndDelete(foundUser._id);
    req.buyer = buyer;
    next();
});
exports.changeForgotPassword = changeForgotPassword;
