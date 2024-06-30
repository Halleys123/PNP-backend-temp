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
exports.SessionModel = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const mongoose_1 = __importDefault(require("mongoose"));
const sessionSchema = new mongoose_1.default.Schema({
    refreshToken: { type: String, required: true },
    deviceFingerprint: { type: String, required: true },
    operatingSystem: { type: String, default: 'unknown' },
    loggedInOn: { type: Date, default: Date.now },
});
sessionSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        this.deviceFingerprint = yield (0, utils_1.hashPassword)(this.deviceFingerprint);
        next();
    });
});
sessionSchema.statics.build = (sessionAttributes) => {
    return new SessionModel(sessionAttributes);
};
const SessionModel = mongoose_1.default.model('Session', sessionSchema);
exports.SessionModel = SessionModel;
