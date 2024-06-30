"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutFromAllDevices = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const sellerPerma_1 = require("../../../../models/seller/schema/sellerPerma");
const sesssions_1 = require("../../../../models/sessions/schema/sesssions");
const logoutFromAllDevices = (0, utils_1.async_error_handler)(async (req, res, next) => {
    const logoutThisDevice = req.query.logoutThisDevice;
    const session = req.session;
    const user = req.seller;
    if (logoutThisDevice == 'true') {
        user.sessions.forEach(async (elem) => {
            await sesssions_1.SessionModel.findByIdAndDelete(elem);
        });
        await sellerPerma_1.SellerModelPerma.findByIdAndUpdate(user._id, {
            $set: { sessions: [] },
        });
    }
    else {
        user.sessions.forEach(async (elem) => {
            if (JSON.stringify(session._id) != JSON.stringify(elem)) {
                await sesssions_1.SessionModel.findByIdAndDelete(elem);
            }
        });
        await sellerPerma_1.SellerModelPerma.findByIdAndUpdate(user._id, {
            $set: { sessions: [session._id] },
        });
    }
    const response = new utils_1.Custom_response(true, null, 'loggedOutSuccessfully', 'success', 200, null);
    res.status(response.statusCode).json(response);
});
exports.logoutFromAllDevices = logoutFromAllDevices;
