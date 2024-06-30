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
exports.logoutFromAllDevices = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const buyerPerma_1 = require("../../../../models/buyer/schema/buyerPerma");
const sesssions_1 = require("../../../../models/sessions/schema/sesssions");
const logoutFromAllDevices = (0, utils_1.async_error_handler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const logoutThisDevice = req.query.logoutThisDevice;
    const session = req.session;
    const user = req.buyer;
    if (logoutThisDevice == 'true') {
        user.sessions.forEach((elem) => __awaiter(void 0, void 0, void 0, function* () {
            yield sesssions_1.SessionModel.findByIdAndDelete(elem);
        }));
        yield buyerPerma_1.BuyerModelPerma.findByIdAndUpdate(user._id, {
            $set: { sessions: [] },
        });
    }
    else {
        user.sessions.forEach((elem) => __awaiter(void 0, void 0, void 0, function* () {
            if (JSON.stringify(session._id) != JSON.stringify(elem)) {
                yield sesssions_1.SessionModel.findByIdAndDelete(elem);
            }
        }));
        yield buyerPerma_1.BuyerModelPerma.findByIdAndUpdate(user._id, {
            $set: { sessions: [session._id] },
        });
    }
    const response = new utils_1.Custom_response(true, null, 'loggedOutSuccessfully', 'success', 200, null);
    res.status(response.statusCode).json(response);
}));
exports.logoutFromAllDevices = logoutFromAllDevices;
