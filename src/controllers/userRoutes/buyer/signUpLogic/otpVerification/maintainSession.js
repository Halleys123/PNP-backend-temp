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
exports.maintainSession = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const buyerPerma_1 = require("../../../../../models/buyer/schema/buyerPerma");
const buyerTemp_1 = require("../../../../../models/buyer/schema/buyerTemp");
const types_1 = require("../../../../../types/types");
const sesssions_1 = require("../../../../../models/sessions/schema/sesssions");
const maintainSession = (0, utils_1.async_error_handler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { name, email, password, phoneNumber } = req.buyer;
    if (req.buyer.phoneOtp.isVerified && req.buyer.emailOtp.isVerified) {
        const permaUser = buyerPerma_1.BuyerModelPerma.build({
            name,
            email,
            password,
            phoneNumber,
        });
        yield permaUser.save();
        yield buyerTemp_1.BuyerModelTemp.findByIdAndDelete(req.buyer._id);
        const accessToken = yield (0, utils_1.createJwt)({
            payload: { _id: permaUser._id, role: types_1.roles.BUYER },
            options: {
                expiresIn: process.env.ACCESS_TOKEN_TIME,
            },
        }, process.env.ACCESS_TOKEN_SECRET);
        const refreshToken = (yield (0, utils_1.createJwt)({
            payload: { _id: permaUser._id, role: types_1.roles.BUYER },
            options: {
                expiresIn: process.env.REFRESH_TOKEN_TIME,
            },
        }, process.env.REFRESH_TOKEN_SECRET));
        const session = sesssions_1.SessionModel.build({
            operatingSystem: (_a = req.device) === null || _a === void 0 ? void 0 : _a.operatingSystem,
            deviceFingerprint: req.device.deviceFingerprint,
            refreshToken: refreshToken,
        });
        yield session.save();
        yield buyerPerma_1.BuyerModelPerma.findByIdAndUpdate(permaUser._id, {
            $push: { sessions: session._id },
        });
        const response = new utils_1.Custom_response(true, null, { refreshToken, accessToken, user: permaUser }, 'success', 200, null);
        res.status(response.statusCode).json(response);
        return;
    }
    else if ((_b = req.buyer) === null || _b === void 0 ? void 0 : _b.emailOtp.isVerified) {
        const response = new utils_1.Custom_response(true, null, 'emailSuccessfullyVerified', 'success', 200, null);
        res.status(response.statusCode).json(response);
        return;
    }
    else {
        const response = new utils_1.Custom_response(true, null, 'phoneSuccessfullyVerified', 'success', 200, null);
        res.status(response.statusCode).json(response);
        return;
    }
}));
exports.maintainSession = maintainSession;
