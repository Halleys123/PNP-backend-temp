"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordLogout = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const sesssions_1 = require("../../../../../models/sessions/schema/sesssions");
const adminPerma_1 = require("../../../../../models/admin/schema/adminPerma");
const changePasswordLogout = (0, utils_1.async_error_handler)(async (req, res, next) => {
    const user = req.admin;
    user.sessions.forEach(async (elem) => {
        await sesssions_1.SessionModel.findByIdAndDelete(elem);
    });
    await adminPerma_1.AdminModelPerma.findByIdAndUpdate(user._id, {
        $set: { sessions: [] },
    });
    const response = new utils_1.Custom_response(true, null, 'passwordChanged', 'success', 200, null);
    res.status(response.statusCode).json(response);
});
exports.changePasswordLogout = changePasswordLogout;
