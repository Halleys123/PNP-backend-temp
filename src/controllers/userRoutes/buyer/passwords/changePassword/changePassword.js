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
exports.changePassword = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const buyerPerma_1 = require("../../../../../models/buyer/schema/buyerPerma");
const sendMailViaThread_1 = require("../../../../../utils/mail/sendMailViaThread");
const changePassword = (0, utils_1.async_error_handler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
    if (!(yield (0, utils_1.checkPasswords)(previousPassword, req.buyer.password)))
        throw new utils_1.Custom_error({
            errors: [{ message: 'passwordDidNotMatch' }],
            statusCode: 400,
        });
    const hashedPassword = yield (0, utils_1.hashPassword)(newPassword);
    yield buyerPerma_1.BuyerModelPerma.findByIdAndUpdate(req.buyer._id, {
        $set: { password: hashedPassword },
    });
    const { name, email } = req.buyer;
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
}));
exports.changePassword = changePassword;
