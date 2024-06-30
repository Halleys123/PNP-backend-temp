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
exports.changePasswordLogout = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const sesssions_1 = require("../../../../../models/sessions/schema/sesssions");
const sellerPerma_1 = require("../../../../../models/seller/schema/sellerPerma");
const changePasswordLogout = (0, utils_1.async_error_handler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.seller;
    user.sessions.forEach((elem) => __awaiter(void 0, void 0, void 0, function* () {
        yield sesssions_1.SessionModel.findByIdAndDelete(elem);
    }));
    yield sellerPerma_1.SellerModelPerma.findByIdAndUpdate(user._id, {
        $set: { sessions: [] },
    });
    const response = new utils_1.Custom_response(true, null, 'passwordChanged', 'success', 200, null);
    res.status(response.statusCode).json(response);
}));
exports.changePasswordLogout = changePasswordLogout;
