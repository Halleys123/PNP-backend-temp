"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const sesssions_1 = require("../../../../models/sessions/schema/sesssions");
const adminPerma_1 = require("../../../../models/admin/schema/adminPerma");
const logout = (0, utils_1.async_error_handler)(async (req, res, next) => {
    const session = req.session;
    const user = req.admin;
    await adminPerma_1.AdminModelPerma.findByIdAndUpdate(user._id, {
        $pull: { sessions: session._id },
    });
    await sesssions_1.SessionModel.findByIdAndDelete(session._id);
    const response = new utils_1.Custom_response(true, null, 'loggedOutSuccessfully', 'success', 200, null);
    res.status(response.statusCode).json(response);
});
exports.logout = logout;
