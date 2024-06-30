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
exports.attachTempBuyer = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const buyerTemp_1 = require("../../../../../../models/buyer/schema/buyerTemp");
const attachTempBuyer = (0, utils_1.async_error_handler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
    const tokenInfo = (yield (0, utils_1.jwtVerification)(token, process.env.JWT_SIGNUP_OTP_SECRET));
    const foundUser = yield buyerTemp_1.BuyerModelTemp.findById(tokenInfo._id);
    if (!foundUser)
        throw new utils_1.Custom_error({
            errors: [{ message: 'noSuchUser' }],
            statusCode: 404,
        });
    if (foundUser.otpJwt != token)
        throw new utils_1.Custom_error({
            errors: [{ message: 'forgedJwt' }],
            statusCode: 401,
        });
    const matchedFingerprint = yield (0, utils_1.checkPasswords)(req.device.deviceFingerprint, foundUser.deviceFingerprint);
    if (!matchedFingerprint)
        throw new utils_1.Custom_error({
            errors: [{ message: 'initiatedSignUpFromSomeOtherDevice' }],
            statusCode: 401,
        });
    req.buyer = foundUser;
    next();
}));
exports.attachTempBuyer = attachTempBuyer;