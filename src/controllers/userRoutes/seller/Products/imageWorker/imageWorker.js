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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const worker_threads_1 = require("worker_threads");
const promises_1 = __importDefault(require("fs/promises"));
const cloudinary_1 = require("../../cloudinary");
function generateSevenDigitRandomNumber() {
    return Math.floor(1000000 + Math.random() * 9000000);
}
function processImage(base64ImageData) {
    return __awaiter(this, void 0, void 0, function* () {
        const imageName = generateSevenDigitRandomNumber();
        const filePath = `${imageName}.png`;
        yield promises_1.default.writeFile(filePath, base64ImageData, 'base64');
        console.log(`File ${filePath} created`);
        const result = yield cloudinary_1.cloudinary.uploader.upload(filePath);
        console.log(`Image uploaded to Cloudinary with URL: ${result.url}`);
        yield promises_1.default.unlink(filePath);
        console.log(`File ${filePath} removed`);
        return result.url;
    });
}
if (!worker_threads_1.parentPort) {
    throw new Error('No parent port');
}
worker_threads_1.parentPort.on('message', (images) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const imageUploadPromises = images.map((element) => {
            const base64ImageData = element.replace(/^data:image\/\w+;base64,/, '');
            return processImage(base64ImageData);
        });
        const uploadedImageUrls = yield Promise.all(imageUploadPromises);
        worker_threads_1.parentPort.postMessage(uploadedImageUrls);
    }
    catch (error) {
        worker_threads_1.parentPort.postMessage({ error: error.message });
    }
}));
