"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const transporter_1 = require("./transporter");
const worker_threads_1 = require("worker_threads");
worker_threads_1.parentPort?.on('message', async (data) => {
    const mail = await (0, exports.sendMail)(data.text, data.subject, data.from_info, data.toSendMail, data.cc, data.html, data.attachment);
});
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
                worker_threads_1.parentPort?.postMessage(err);
            }
            else {
                resolve(info);
                worker_threads_1.parentPort?.postMessage('emailSent');
            }
        });
    });
};
exports.sendMail = sendMail;
worker_threads_1.parentPort?.postMessage('hello');
