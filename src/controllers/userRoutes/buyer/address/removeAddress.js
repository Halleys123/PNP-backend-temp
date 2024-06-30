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
const utils_1 = require("@himanshu_guptaorg/utils");
const buyerPerma_1 = require("../../../../models/buyer/schema/buyerPerma");
const removeAddresss = (0, utils_1.async_error_handler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { addressIndex } = req.body;
    if (!addressIndex) {
        throw new utils_1.Custom_error({
            errors: [{ message: 'sendMeTheAddressIndex' }],
            statusCode: 400,
        });
    }
    req.buyer.address.splice(addressIndex, 1);
    yield buyerPerma_1.BuyerModelPerma.findByIdAndUpdate(req.buyer._id, {
        $set: { address: req.buyer.address },
    });
}));
