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
exports.sendMail = void 0;
const transporter_1 = require("./transporter");
const worker_threads_1 = require("worker_threads");
worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.on('message', (data) => __awaiter(void 0, void 0, void 0, function* () {
    const mail = yield (0, exports.sendMail)(data.text, data.subject, data.from_info, data.toSendMail, data.cc, data.html, data.attachment);
}));
const sendMail = (text, subject, from_info, toSendMail, cc, html, attachment = null) => {
    return new Promise((resolve, reject) => {
        let mailOptions = {
            from: `${from_info} <${process.env.EMAIL}>`,
            to: toSendMail,
            subject: `${subject}`,
            text: `${text}`,
            cc: cc,
            html: html ? html : text,
            attachments: attachment,
        };
        (0, transporter_1.createTransporter)().sendMail(mailOptions, (err, info) => {
            if (err) {
                reject(err);
                worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.postMessage(err);
            }
            else {
                resolve(info);
                worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.postMessage('emailSent');
            }
        });
    });
};
exports.sendMail = sendMail;
worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.postMessage('hello');
