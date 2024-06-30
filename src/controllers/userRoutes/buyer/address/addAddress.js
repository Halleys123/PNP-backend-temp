"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addAddress = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const buyerPerma_1 = require("../../../../models/buyer/schema/buyerPerma");
const addAddress = (0, utils_1.async_error_handler)(async (req, res, next) => {
    const { address } = req.body;
    if (!address ||
        !address.houseNumber ||
        !address.street ||
        !address.city ||
        !address.pincode)
        throw new utils_1.Custom_error({
            errors: [{ message: 'sendCompleteAddress' }],
            statusCode: 400,
        });
    await buyerPerma_1.BuyerModelPerma.findByIdAndUpdate(req.buyer._id, {
        $push: { address },
    });
    const response = new utils_1.Custom_response(true, null, 'addedAddress', 'success', 200, null);
    res.status(response.statusCode).json(response);
});
exports.addAddress = addAddress;
