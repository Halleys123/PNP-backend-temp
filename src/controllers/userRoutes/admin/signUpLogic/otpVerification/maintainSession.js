"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maintainSession = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const adminPerma_1 = require("../../../../../models/admin/schema/adminPerma");
const adminTemp_1 = require("../../../../../models/admin/schema/adminTemp");
const sesssions_1 = require("../../../../../models/sessions/schema/sesssions");
const maintainSession = (0, utils_1.async_error_handler)(async (req, res, next) => {
    const { name, email, password, phoneNumber, designation } = req.admin;
    const permaUser = adminPerma_1.AdminModelPerma.build({
        name,
        email,
        password,
        phoneNumber,
        designation,
    });
    await permaUser.save();
    await adminTemp_1.AdminModelTemp.findByIdAndDelete(req.admin._id);
    const accessToken = await (0, utils_1.createJwt)({
        payload: { _id: permaUser._id },
        options: {
            expiresIn: process.env.ACCESS_TOKEN_TIME,
        },
    }, process.env.ACCESS_TOKEN_SECRET);
    const refreshToken = (await (0, utils_1.createJwt)({
        payload: { _id: permaUser._id },
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
    await adminPerma_1.AdminModelPerma.findByIdAndUpdate(permaUser._id, {
        $push: { sessions: session._id },
    });
    const response = new utils_1.Custom_response(true, null, { refreshToken, accessToken }, 'success', 200, null);
    res.status(response.statusCode).json(response);
    return;
});
exports.maintainSession = maintainSession;
