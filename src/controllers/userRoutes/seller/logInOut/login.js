"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const sellerPerma_1 = require("../../../../models/seller/schema/sellerPerma");
const types_1 = require("../../../../types/types");
const sesssions_1 = require("../../../../models/sessions/schema/sesssions");
const login = (0, utils_1.async_error_handler)(async (req, res, next) => {
    const { email, password } = req.body;
    console.log(email, password);
    if (!email || !password)
        throw new utils_1.Custom_error({
            errors: [{ message: 'invalidEmailOrPassword' }],
            statusCode: 400,
        });
    const permaUser = await sellerPerma_1.SellerModelPerma.findOne({ email }).select('+password');
    console.log(permaUser);
    if (!permaUser)
        throw new utils_1.Custom_error({
            errors: [{ message: 'invalidEmailOrPassword' }],
            statusCode: 403,
        });
    const isPasswordCorrect = await (0, utils_1.checkPasswords)(password, permaUser.password);
    if (!isPasswordCorrect)
        throw new utils_1.Custom_error({
            errors: [{ message: 'invalidEmailOrPassword' }],
            statusCode: 403,
        });
    const accessToken = await (0, utils_1.createJwt)({
        payload: { _id: permaUser._id, role: types_1.roles.BUYER },
        options: {
            expiresIn: process.env.ACCESS_TOKEN_TIME,
        },
    }, process.env.ACCESS_TOKEN_SECRET);
    const refreshToken = (await (0, utils_1.createJwt)({
        payload: { _id: permaUser._id, role: types_1.roles.BUYER },
        options: {
            expiresIn: process.env.REFRESH_TOKEN_TIME,
        },
    }, process.env.REFRESH_TOKEN_SECRET));
    const session = sesssions_1.SessionModel.build({
        operatingSystem: req.device?.operatingSystem,
        deviceFingerprint: req.device.deviceFingerprint,
        refreshToken: refreshToken,
    });
    await session.save();
    await sellerPerma_1.SellerModelPerma.findByIdAndUpdate(permaUser._id, {
        $push: { sessions: session._id },
    });
    const response = new utils_1.Custom_response(true, null, { refreshToken, accessToken }, 'success', 200, null);
    res.status(response.statusCode).json(response);
});
exports.login = login;
