"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const adminPerma_1 = require("../../../../../models/admin/schema/adminPerma");
const sendMailViaThread_1 = require("../../../../../utils/mail/sendMailViaThread");
const changePassword = (0, utils_1.async_error_handler)(async (req, res, next) => {
    const { previousPassword, newPassword } = req.body;
    if (!previousPassword)
        throw new utils_1.Custom_error({
            errors: [{ message: 'previousPasswordRequired' }],
            statusCode: 400,
        });
    if (!newPassword)
        throw new utils_1.Custom_error({
            errors: [{ message: 'newPasswordRequired' }],
            statusCode: 400,
        });
    if (!(await (0, utils_1.checkPasswords)(previousPassword, req.admin.password)))
        throw new utils_1.Custom_error({
            errors: [{ message: 'passwordDidNotMatch' }],
            statusCode: 400,
        });
    const hashedPassword = await (0, utils_1.hashPassword)(newPassword);
    await adminPerma_1.AdminModelPerma.findByIdAndUpdate(req.admin._id, {
        $set: { password: hashedPassword },
    });
    const { name, email } = req.admin;
    (0, sendMailViaThread_1.sendMailViaThread)({
        text: `Hi ${name} your passwoer has been successfully changed`,
        subject: 'Plants and Pots Paradise SignUp',
        from_info: 'Himanshu Gupta',
        toSendMail: email,
        cc: null,
        html: `<h1>Hi ${name} your passwoer has been successfully changed</h1>`,
        attachment: null,
    });
    next();
});
exports.changePassword = changePassword;
