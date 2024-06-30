"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachPermaSeller = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const sellerPerma_1 = require("../../../../models/seller/schema/sellerPerma");
const attachPermaSeller = (0, utils_1.async_error_handler)(async (req, res, next) => {
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
    const foundUser = await sellerPerma_1.SellerModelPerma.findById(tokenInfo._id).select('+password');
    if (!foundUser)
        throw new utils_1.Custom_error({
            errors: [{ message: 'noSuchUser' }],
            statusCode: 404,
        });
    req.seller = foundUser;
    next();
});
exports.attachPermaSeller = attachPermaSeller;
