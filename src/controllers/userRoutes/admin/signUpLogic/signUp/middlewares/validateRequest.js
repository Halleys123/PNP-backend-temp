"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const adminTemp_1 = require("../../../../../../models/admin/schema/adminTemp");
const common_1 = require("../../../../../../models/admin/utils/common");
const adminPerma_1 = require("../../../../../../models/admin/schema/adminPerma");
const validateRequest = (0, utils_1.async_error_handler)(async (req, res, next) => {
    const { name, email, phoneNumber, password, designation } = req.body;
    if (designation == common_1.AdminType.MAIN_ADMIN) {
        const mainAdmin = await adminPerma_1.AdminModelPerma.findOne({
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
    const existingUserPhoneTemp = await adminTemp_1.AdminModelTemp.findOne({
        phoneNumber,
    });
    if (existingUserPhoneTemp) {
        if (new Date(existingUserPhoneTemp?.expiresAt) > new Date(Date.now())) {
            throw new utils_1.Custom_error({
                errors: [{ message: 'adminWithThisPhoneAleadyExists' }],
                statusCode: 400,
            });
        }
        else
            await adminTemp_1.AdminModelTemp.findByIdAndDelete(existingUserPhoneTemp._id);
    }
    const existingUserEmailTemp = await adminTemp_1.AdminModelTemp.findOne({
        email,
    });
    if (existingUserEmailTemp) {
        if (new Date(existingUserEmailTemp?.expiresAt) > new Date(Date.now()))
            throw new utils_1.Custom_error({
                errors: [{ message: 'adminWithThisEmailAleadyExists' }],
                statusCode: 400,
            });
        else
            await adminTemp_1.AdminModelTemp.findByIdAndDelete(existingUserEmailTemp._id);
    }
    const existingUserEmailPerma = await adminPerma_1.AdminModelPerma.findOne({ email });
    if (existingUserEmailPerma)
        throw new utils_1.Custom_error({
            errors: [{ message: 'adminWithThisEmailAleadyExists' }],
            statusCode: 400,
        });
    const existingUserPhonePerma = await adminPerma_1.AdminModelPerma.findOne({
        phoneNumber,
    });
    if (existingUserPhonePerma)
        throw new utils_1.Custom_error({
            errors: [{ message: 'adminWithThisPhoneAleadyExists' }],
            statusCode: 400,
        });
    next();
});
exports.validateRequest = validateRequest;
