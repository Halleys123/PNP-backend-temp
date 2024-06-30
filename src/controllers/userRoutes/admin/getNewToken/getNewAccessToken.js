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
exports.getNewAccessToken = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const types_1 = require("../../../../types/types");
const sesssions_1 = require("../../../../models/sessions/schema/sesssions");
const getNewAccessToken = (0, utils_1.async_error_handler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const permaUser = req.admin;
    const accessToken = yield (0, utils_1.createJwt)({
        payload: { _id: permaUser._id, role: types_1.roles.ADMIN },
        options: {
            expiresIn: process.env.ACCESS_TOKEN_TIME,
        },
    }, process.env.ACCESS_TOKEN_SECRET);
    const refreshToken = (yield (0, utils_1.createJwt)({
        payload: { _id: permaUser._id, role: types_1.roles.ADMIN },
        options: {
            expiresIn: process.env.REFRESH_TOKEN_TIME,
        },
    }, process.env.REFRESH_TOKEN_SECRET));
    yield sesssions_1.SessionModel.findByIdAndUpdate(req.session._id, {
        $set: { refreshToken },
    });
    const response = new utils_1.Custom_response(true, null, { refreshToken, accessToken }, 'success', 200, null);
    res.status(response.statusCode).json(response);
}));
exports.getNewAccessToken = getNewAccessToken;
