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
exports.isMainAdmin = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const common_1 = require("../../../../models/admin/utils/common");
const isMainAdmin = (0, utils_1.async_error_handler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.admin.designation != common_1.AdminType.MAIN_ADMIN)
        throw new utils_1.Custom_error({
            errors: [{ message: 'notMainAdmin' }],
            statusCode: 401,
        });
    next();
}));
exports.isMainAdmin = isMainAdmin;