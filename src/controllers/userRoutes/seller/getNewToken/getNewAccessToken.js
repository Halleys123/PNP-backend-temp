"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNewAccessToken = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const types_1 = require("../../../../types/types");
const sesssions_1 = require("../../../../models/sessions/schema/sesssions");
const getNewAccessToken = (0, utils_1.async_error_handler)(async (req, res, next) => {
    console.log('getNewAccessToken');
    console.log(req.seller);
    const permaUser = req.seller;
    const accessToken = await (0, utils_1.createJwt)({
        payload: { _id: permaUser._id, role: types_1.roles.SELLER },
        options: {
            expiresIn: process.env.ACCESS_TOKEN_TIME,
        },
    }, process.env.ACCESS_TOKEN_SECRET);
    const refreshToken = (await (0, utils_1.createJwt)({
        payload: { _id: permaUser._id, role: types_1.roles.SELLER },
        options: {
            expiresIn: process.env.REFRESH_TOKEN_TIME,
        },
    }, process.env.REFRESH_TOKEN_SECRET));
    await sesssions_1.SessionModel.findByIdAndUpdate(req.session._id, {
        $set: { refreshToken },
    });
    const response = new utils_1.Custom_response(true, null, { refreshToken, accessToken }, 'success', 200, null);
    res.status(response.statusCode).json(response);
});
exports.getNewAccessToken = getNewAccessToken;
