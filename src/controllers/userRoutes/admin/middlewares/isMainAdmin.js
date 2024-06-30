"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMainAdmin = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const common_1 = require("../../../../models/admin/utils/common");
const isMainAdmin = (0, utils_1.async_error_handler)(async (req, res, next) => {
    if (req.admin.designation != common_1.AdminType.MAIN_ADMIN)
        throw new utils_1.Custom_error({
            errors: [{ message: 'notMainAdmin' }],
            statusCode: 401,
        });
    next();
});
exports.isMainAdmin = isMainAdmin;
