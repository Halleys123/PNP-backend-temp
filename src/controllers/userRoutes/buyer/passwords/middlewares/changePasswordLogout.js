"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordLogout = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const sesssions_1 = require("../../../../../models/sessions/schema/sesssions");
const buyerPerma_1 = require("../../../../../models/buyer/schema/buyerPerma");
const changePasswordLogout = (0, utils_1.async_error_handler)(async (req, res, next) => {
    const user = req.buyer;
    user.sessions.forEach(async (elem) => {
        await sesssions_1.SessionModel.findByIdAndDelete(elem);
    });
    await buyerPerma_1.BuyerModelPerma.findByIdAndUpdate(user._id, {
        $set: { sessions: [] },
    });
    const response = new utils_1.Custom_response(true, null, 'passwordChanged', 'success', 200, null);
    res.status(response.statusCode).json(response);
});
exports.changePasswordLogout = changePasswordLogout;
