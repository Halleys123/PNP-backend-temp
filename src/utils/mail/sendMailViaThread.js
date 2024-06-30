"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMailViaThread = void 0;
const path_1 = __importDefault(require("path"));
const worker_threads_1 = require("worker_threads");
const sendMailViaThread = (options) => {
    let worker = new worker_threads_1.Worker(path_1.default.resolve(__dirname, './sendMail.ts'));
    const { text, subject, from_info, toSendMail, html, cc, attachment } = options;
    worker.postMessage({
        text,
        subject,
        from_info,
        toSendMail,
        html,
        cc,
        attachment,
    });
    worker.on('message', (message) => {
        console.log(message);
    });
};
exports.sendMailViaThread = sendMailViaThread;
