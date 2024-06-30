"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModelPerma = void 0;
const mongoose_1 = require("mongoose");
const common_1 = require("../utils/common");
const mongoose_2 = __importDefault(require("mongoose"));
const AdminPermaSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    designation: { type: String, enum: Object.values(common_1.AdminType) },
    password: { type: String, required: true, select: false },
    phoneNumber: {
        type: String,
        required: true,
    },
    isVerifiedByMainAdmin: {
        type: Boolean,
        default: false,
        required: true,
    },
    sessions: { type: [mongoose_1.Schema.Types.ObjectId], ref: 'Session' },
});
AdminPermaSchema.statics.build = function (adminAttributes) {
    return new this(adminAttributes);
};
const AdminModelPerma = mongoose_2.default.model('AdminPerma', AdminPermaSchema);
exports.AdminModelPerma = AdminModelPerma;
