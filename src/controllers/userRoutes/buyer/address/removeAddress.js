"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@himanshu_guptaorg/utils");
const buyerPerma_1 = require("../../../../models/buyer/schema/buyerPerma");
const removeAddresss = (0, utils_1.async_error_handler)(async (req, res, next) => {
    const { addressIndex } = req.body;
    if (!addressIndex) {
        throw new utils_1.Custom_error({
            errors: [{ message: 'sendMeTheAddressIndex' }],
            statusCode: 400,
        });
    }
    req.buyer.address.splice(addressIndex, 1);
    await buyerPerma_1.BuyerModelPerma.findByIdAndUpdate(req.buyer._id, {
        $set: { address: req.buyer.address },
    });
});
