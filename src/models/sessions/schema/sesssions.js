"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionModel = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const mongoose_1 = __importDefault(require("mongoose"));
const sessionSchema = new mongoose_1.default.Schema({
    refreshToken: { type: String, required: true },
    deviceFingerprint: { type: String, required: true },
    operatingSystem: { type: String, default: 'unknown' },
    loggedInOn: { type: Date, default: Date.now },
});
sessionSchema.pre('save', async function (next) {
    this.deviceFingerprint = await (0, utils_1.hashPassword)(this.deviceFingerprint);
    next();
});
sessionSchema.statics.build = (sessionAttributes) => {
    return new SessionModel(sessionAttributes);
};
const SessionModel = mongoose_1.default.model('Session', sessionSchema);
exports.SessionModel = SessionModel;
