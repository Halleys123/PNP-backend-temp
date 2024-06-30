"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachPermaSeller = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const sellerPerma_1 = require("../../../../models/seller/schema/sellerPerma");
const attachPermaSeller = (0, utils_1.async_error_handler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
    const tokenInfo = (yield (0, utils_1.jwtVerification)(token, process.env.ACCESS_TOKEN_SECRET));
    const foundUser = yield sellerPerma_1.SellerModelPerma.findById(tokenInfo._id).select('+password');
    if (!foundUser)
        throw new utils_1.Custom_error({
            errors: [{ message: 'noSuchUser' }],
            statusCode: 404,
        });
    req.seller = foundUser;
    next();
}));
exports.attachPermaSeller = attachPermaSeller;
