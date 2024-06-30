"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachAdminViaRefresh = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const adminPerma_1 = require("../../../../models/admin/schema/adminPerma");
const sesssions_1 = require("../../../../models/sessions/schema/sesssions");
const attachAdminViaRefresh = (0, utils_1.async_error_handler)(async (req, res, next) => {
    const refreshToken = req.headers.authentication;
    if (!refreshToken)
        throw new utils_1.Custom_error({
            errors: [{ message: 'sendTheRefreshToken' }],
            statusCode: 400,
        });
    if (!refreshToken.startsWith('Bearer'))
        throw new utils_1.Custom_error({
            errors: [{ message: 'invalidToken' }],
            statusCode: 401,
        });
    const jwt = refreshToken.split(' ')[1];
    const decodedToken = (await (0, utils_1.jwtVerification)(jwt, process.env.REFRESH_TOKEN_SECRET));
    const user = await adminPerma_1.AdminModelPerma.findById(decodedToken._id);
    if (!user)
        throw new utils_1.Custom_error({
            errors: [{ message: 'noSuchUserFound' }],
            statusCode: 404,
        });
    const session = await sesssions_1.SessionModel.findOne({ refreshToken: jwt });
    if (!session)
        throw new utils_1.Custom_error({
            errors: [{ message: 'noSuchSessionActive' }],
            statusCode: 400,
        });
    const isFingerprintMatching = await (0, utils_1.checkPasswords)(req.device?.deviceFingerprint, session.deviceFingerprint);
    if (!isFingerprintMatching)
        throw new utils_1.Custom_error({
            errors: [{ message: 'notAValidDevice' }],
            statusCode: 400,
        });
    req.session = session;
    req.admin = user;
    next();
});
exports.attachAdminViaRefresh = attachAdminViaRefresh;
