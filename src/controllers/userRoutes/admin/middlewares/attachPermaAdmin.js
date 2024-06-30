"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachPermaAdmin = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const adminPerma_1 = require("../../../../models/admin/schema/adminPerma");
const common_1 = require("../../../../models/admin/utils/common");
const attachPermaAdmin = (0, utils_1.async_error_handler)(async (req, res, next) => {
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
    const tokenInfo = (await (0, utils_1.jwtVerification)(token, process.env.ACCESS_TOKEN_SECRET));
    const foundUser = await adminPerma_1.AdminModelPerma.findById(tokenInfo._id);
    if (!foundUser)
        throw new utils_1.Custom_error({
            errors: [{ message: 'noSuchUser' }],
            statusCode: 404,
        });
    if (foundUser.designation != common_1.AdminType.MAIN_ADMIN &&
        !foundUser.isVerifiedByMainAdmin)
        throw new utils_1.Custom_error({
            errors: [{ message: 'getYourselfVerifiedByAdmin' }],
            statusCode: 401,
        });
    req.admin = foundUser;
    next();
});
exports.attachPermaAdmin = attachPermaAdmin;
