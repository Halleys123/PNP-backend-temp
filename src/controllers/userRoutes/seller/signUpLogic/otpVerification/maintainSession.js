"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maintainSession = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const sellerPerma_1 = require("../../../../../models/seller/schema/sellerPerma");
const sellerTemp_1 = require("../../../../../models/seller/schema/sellerTemp");
const types_1 = require("../../../../../types/types");
const sesssions_1 = require("../../../../../models/sessions/schema/sesssions");
const maintainSession = (0, utils_1.async_error_handler)(async (req, res, next) => {
    const { name, email, password, phoneNumber, address, bankAccount, accountInfo, } = req.seller;
    if (req.seller.phoneOtp.isVerified && req.seller.emailOtp.isVerified) {
        const permaUser = sellerPerma_1.SellerModelPerma.build({
            name,
            email,
            password,
            phoneNumber,
            address,
            bankAccount,
            accountInfo,
        });
        await permaUser.save();
        await sellerTemp_1.SellerModelTemp.findByIdAndDelete(req.seller._id);
        const accessToken = await (0, utils_1.createJwt)({
            payload: { _id: permaUser._id, role: types_1.roles.SELLER },
            options: {
                expiresIn: process.env.ACCESS_TOKEN_TIME,
            },
        }, process.env.ACCESS_TOKEN_SECRET);
        const refreshToken = (await (0, utils_1.createJwt)({
            payload: { _id: permaUser._id, role: types_1.roles.SELLER },
            options: {
                expiresIn: process.env.REFRESH_TOKEN_TIME,
            },
        }, process.env.REFRESH_TOKEN_SECRET));
        const session = sesssions_1.SessionModel.build({
            operatingSystem: req.device?.operatingSystem,
            deviceFingerprint: req.device.deviceFingerprint,
            refreshToken: refreshToken,
        });
        await session.save();
        await sellerPerma_1.SellerModelPerma.findByIdAndUpdate(permaUser._id, {
            $push: { sessions: session._id },
        });
        const response = new utils_1.Custom_response(true, null, { refreshToken, accessToken }, 'success', 200, null);
        res.status(response.statusCode).json(response);
        return;
    }
    else if (req.seller?.emailOtp.isVerified) {
        const response = new utils_1.Custom_response(true, null, 'emailSuccessfullyVerified', 'success', 200, null);
        res.status(response.statusCode).json(response);
        return;
    }
    else {
        const response = new utils_1.Custom_response(true, null, 'phoneSuccessfullyVerified', 'success', 200, null);
        res.status(response.statusCode).json(response);
        return;
    }
});
exports.maintainSession = maintainSession;
