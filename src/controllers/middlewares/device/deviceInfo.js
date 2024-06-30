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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDeviceInfo = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const express_useragent_1 = __importDefault(require("express-useragent"));
const getDeviceInfo = (0, utils_1.async_error_handler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userAgentFromRequest = req.headers['user-agent'];
        if (!userAgentFromRequest) {
            throw new utils_1.Custom_error({
                errors: [{ message: 'noUser-agentFound' }],
                statusCode: 400,
            });
        }
        const agent = express_useragent_1.default.parse(userAgentFromRequest);
        const deviceInfo = `Browser: ${agent.browser}Operating System: ${agent.os}Version: ${agent.version}Is Mobile: ${agent.isMobile}Is Desktop: ${agent.isDesktop}Platform: ${agent.platform}Source: ${userAgentFromRequest}`;
        req.device = {};
        req.device.hashedDeviceFingerprint = yield (0, utils_1.hashPassword)(deviceInfo);
        req.device.deviceFingerprint = deviceInfo;
        req.device.operatingSystem = agent.os;
        next();
    }
    catch (err) {
        next(err);
    }
}));
exports.getDeviceInfo = getDeviceInfo;
