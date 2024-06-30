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
exports.logout = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const sesssions_1 = require("../../../../models/sessions/schema/sesssions");
const adminPerma_1 = require("../../../../models/admin/schema/adminPerma");
const logout = (0, utils_1.async_error_handler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const session = req.session;
    const user = req.admin;
    yield adminPerma_1.AdminModelPerma.findByIdAndUpdate(user._id, {
        $pull: { sessions: session._id },
    });
    yield sesssions_1.SessionModel.findByIdAndDelete(session._id);
    const response = new utils_1.Custom_response(true, null, 'loggedOutSuccessfully', 'success', 200, null);
    res.status(response.statusCode).json(response);
}));
exports.logout = logout;
