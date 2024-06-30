"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAdmin = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const adminPerma_1 = require("../../../../models/admin/schema/adminPerma");
const verifyAdmin = (0, utils_1.async_error_handler)(async (req, res, next) => {
    const { adminToBeVerified, toVerify } = req.body;
    if (!adminToBeVerified)
        throw new utils_1.Custom_error({
            errors: [{ message: 'giveMeTheAdminToBeVerified' }],
            statusCode: 400,
        });
    if (typeof toVerify != 'boolean')
        throw new utils_1.Custom_error({
            errors: [{ message: 'theToVerifyMustBeABoolean' }],
            statusCode: 400,
        });
    if (toVerify)
        await adminPerma_1.AdminModelPerma.findByIdAndUpdate(adminToBeVerified, {
            $set: { isVerifiedByMainAdmin: true },
        });
    else
        await adminPerma_1.AdminModelPerma.findByIdAndDelete(adminToBeVerified);
    const response = new utils_1.Custom_response(true, null, 'updatedSuccesfully', 'success', 200, null);
    res.status(response.statusCode).json(response);
});
exports.verifyAdmin = verifyAdmin;
