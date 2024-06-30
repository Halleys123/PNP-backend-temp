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
exports.attachBuyerViaRefresh = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const buyerPerma_1 = require("../../../../models/buyer/schema/buyerPerma");
const sesssions_1 = require("../../../../models/sessions/schema/sesssions");
const attachBuyerViaRefresh = (0, utils_1.async_error_handler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
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
    const decodedToken = (yield (0, utils_1.jwtVerification)(jwt, process.env.REFRESH_TOKEN_SECRET));
    const user = yield buyerPerma_1.BuyerModelPerma.findById(decodedToken._id);
    if (!user)
        throw new utils_1.Custom_error({
            errors: [{ message: 'noSuchUserFound' }],
            statusCode: 404,
        });
    const session = yield sesssions_1.SessionModel.findOne({ refreshToken: jwt });
    if (!session)
        throw new utils_1.Custom_error({
            errors: [{ message: 'noSuchSessionActive' }],
            statusCode: 400,
        });
    const isFingerprintMatching = yield (0, utils_1.checkPasswords)((_a = req.device) === null || _a === void 0 ? void 0 : _a.deviceFingerprint, session.deviceFingerprint);
    if (!isFingerprintMatching)
        throw new utils_1.Custom_error({
            errors: [{ message: 'notAValidDevice' }],
            statusCode: 400,
        });
    req.session = session;
    req.buyer = user;
    next();
}));
exports.attachBuyerViaRefresh = attachBuyerViaRefresh;
