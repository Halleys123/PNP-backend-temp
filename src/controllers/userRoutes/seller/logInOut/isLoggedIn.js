"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLoggedIn = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const isLoggedIn = (0, utils_1.async_error_handler)(async (req, res, next) => {
    const response = new utils_1.Custom_response(true, null, req.seller, 'success', 200, null);
    res.status(response.statusCode).json(response);
});
exports.isLoggedIn = isLoggedIn;
