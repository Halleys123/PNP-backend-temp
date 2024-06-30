"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutFromAllDevices = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const adminPerma_1 = require("../../../../models/admin/schema/adminPerma");
const sesssions_1 = require("../../../../models/sessions/schema/sesssions");
const logoutFromAllDevices = (0, utils_1.async_error_handler)(async (req, res, next) => {
    const logoutThisDevice = req.query.logoutThisDevice;
    const session = req.session;
    const user = req.admin;
    if (logoutThisDevice == 'true') {
        user.sessions.forEach(async (elem) => {
            await sesssions_1.SessionModel.findByIdAndDelete(elem);
        });
        await adminPerma_1.AdminModelPerma.findByIdAndUpdate(user._id, {
            $set: { sessions: [] },
        });
    }
    else {
        user.sessions.forEach(async (elem) => {
            if (JSON.stringify(session._id) != JSON.stringify(elem)) {
                await sesssions_1.SessionModel.findByIdAndDelete(elem);
            }
        });
        await adminPerma_1.AdminModelPerma.findByIdAndUpdate(user._id, {
            $set: { sessions: [session._id] },
        });
    }
    const response = new utils_1.Custom_response(true, null, 'loggedOutSuccessfully', 'success', 200, null);
    res.status(response.statusCode).json(response);
});
exports.logoutFromAllDevices = logoutFromAllDevices;
