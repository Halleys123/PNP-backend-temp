"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUnverifiedAdmins = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const adminPerma_1 = require("../../../../models/admin/schema/adminPerma");
const common_1 = require("../../../../models/admin/utils/common");
const getUnverifiedAdmins = (0, utils_1.async_error_handler)(async (req, res, next) => {
    const unverifiedAdmins = await adminPerma_1.AdminModelPerma.find({
        isVerifiedByMainAdmin: false,
        designation: { $ne: common_1.AdminType.MAIN_ADMIN },
    });
    const response = new utils_1.Custom_response(true, null, {
        unverifiedAdmins,
    }, "success", 200, null);
    res.status(response.statusCode).json(response);
});
exports.getUnverifiedAdmins = getUnverifiedAdmins;
