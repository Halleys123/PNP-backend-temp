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
exports.validateRequest = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const adminTemp_1 = require("../../../../../../models/admin/schema/adminTemp");
const common_1 = require("../../../../../../models/admin/utils/common");
const adminPerma_1 = require("../../../../../../models/admin/schema/adminPerma");
const validateRequest = (0, utils_1.async_error_handler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, phoneNumber, password, designation } = req.body;
    if (designation == common_1.AdminType.MAIN_ADMIN) {
        const mainAdmin = yield adminPerma_1.AdminModelPerma.findOne({
            designation: common_1.AdminType.MAIN_ADMIN,
        });
        if (mainAdmin)
            throw new utils_1.Custom_error({
                errors: [{ message: 'mainAdminAlreadyExists' }],
                statusCode: 400,
            });
    }
    if (!name)
        throw new utils_1.Custom_error({
            errors: [{ message: 'sendName' }],
            statusCode: 400,
        });
    if (!email)
        throw new utils_1.Custom_error({
            errors: [{ message: 'sendEmail' }],
            statusCode: 400,
        });
    if (!password)
        throw new utils_1.Custom_error({
            errors: [{ message: 'sendPassword' }],
            statusCode: 400,
        });
    if (!phoneNumber)
        throw new utils_1.Custom_error({
            errors: [{ message: 'sendPhoneNumber' }],
            statusCode: 400,
        });
    if (!designation)
        throw new utils_1.Custom_error({
            errors: [{ message: 'sendDesignation' }],
            statusCode: 400,
        });
    const existingUserPhoneTemp = yield adminTemp_1.AdminModelTemp.findOne({
        phoneNumber,
    });
    if (existingUserPhoneTemp) {
        if (new Date(existingUserPhoneTemp === null || existingUserPhoneTemp === void 0 ? void 0 : existingUserPhoneTemp.expiresAt) > new Date(Date.now())) {
            throw new utils_1.Custom_error({
                errors: [{ message: 'adminWithThisPhoneAleadyExists' }],
                statusCode: 400,
            });
        }
        else
            yield adminTemp_1.AdminModelTemp.findByIdAndDelete(existingUserPhoneTemp._id);
    }
    const existingUserEmailTemp = yield adminTemp_1.AdminModelTemp.findOne({
        email,
    });
    if (existingUserEmailTemp) {
        if (new Date(existingUserEmailTemp === null || existingUserEmailTemp === void 0 ? void 0 : existingUserEmailTemp.expiresAt) > new Date(Date.now()))
            throw new utils_1.Custom_error({
                errors: [{ message: 'adminWithThisEmailAleadyExists' }],
                statusCode: 400,
            });
        else
            yield adminTemp_1.AdminModelTemp.findByIdAndDelete(existingUserEmailTemp._id);
    }
    const existingUserEmailPerma = yield adminPerma_1.AdminModelPerma.findOne({ email });
    if (existingUserEmailPerma)
        throw new utils_1.Custom_error({
            errors: [{ message: 'adminWithThisEmailAleadyExists' }],
            statusCode: 400,
        });
    const existingUserPhonePerma = yield adminPerma_1.AdminModelPerma.findOne({
        phoneNumber,
    });
    if (existingUserPhonePerma)
        throw new utils_1.Custom_error({
            errors: [{ message: 'adminWithThisPhoneAleadyExists' }],
            statusCode: 400,
        });
    next();
}));
exports.validateRequest = validateRequest;
