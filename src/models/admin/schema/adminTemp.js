"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModelTemp = void 0;
exports.calculateExpiry = calculateExpiry;
const mongoose_1 = require("mongoose");
const common_1 = require("../utils/common");
const mongoose_2 = __importDefault(require("mongoose"));
function calculateExpiry() {
    const expiresIn = process.env.SIGNUP_OTP_TIME;
    return new Date(Date.now() +
        1000 * 60 * parseInt(expiresIn.substring(0, expiresIn.length - 1)));
}
const AdminTempSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    designation: { type: String, enum: Object.values(common_1.AdminType), required: true },
    phoneNumber: {
        type: String,
        required: true,
    },
    otpSentTimes: {
        type: Number,
        required: true,
        default: 1,
    },
    otp: { type: String },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    expiresAt: {
        type: Date,
        default: calculateExpiry,
    },
    deviceFingerprint: {
        type: String,
        required: true,
    },
    otpJwt: { type: String },
    password: { type: String, required: true },
});
AdminTempSchema.statics.build = function (adminAttributes) {
    return new this(adminAttributes);
};
const AdminModelTemp = mongoose_2.default.model('AdminTemp', AdminTempSchema);
exports.AdminModelTemp = AdminModelTemp;
