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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const utils_1 = require("@himanshu_guptaorg/utils");
const router_1 = require("./controllers/userRoutes/buyer/router");
const router_2 = require("./controllers/userRoutes/seller/router");
const router_3 = require("./controllers/userRoutes/admin/router");
const router_4 = require("./controllers/userRoutes/delivery/router");
const requestCheckerMiddleWare = (0, utils_1.async_error_handler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.url);
    next();
}));
const app = (0, express_1.default)();
exports.app = app;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/v1/buyer', requestCheckerMiddleWare, router_1.buyerRouter);
app.use('/api/v1/seller', requestCheckerMiddleWare, router_2.sellerRouter);
app.use('/api/v1/admin', requestCheckerMiddleWare, router_3.adminRouter);
app.use('/api/v1/delivery', requestCheckerMiddleWare, router_4.deliveryRouter);
app.all('*', (req, res, next) => {
    const err = new utils_1.Custom_error({
        errors: [{ message: 'pageNotFound' }],
        statusCode: 404,
    });
    next(err);
});
app.use(utils_1.error_middleware);
