"use strict";
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
async function processImage(base64ImageData) {
    const imageName = generateSevenDigitRandomNumber();
    const filePath = `${imageName}.png`;
    await promises_1.default.writeFile(filePath, base64ImageData, 'base64');
    console.log(`File ${filePath} created`);
    const result = await cloudinary_1.cloudinary.uploader.upload(filePath);
    console.log(`Image uploaded to Cloudinary with URL: ${result.url}`);
    await promises_1.default.unlink(filePath);
    console.log(`File ${filePath} removed`);
    return result.url;
}
if (!worker_threads_1.parentPort) {
    throw new Error('No parent port');
}
worker_threads_1.parentPort.on('message', async (images) => {
    try {
        const imageUploadPromises = images.map((element) => {
            const base64ImageData = element.replace(/^data:image\/\w+;base64,/, '');
            return processImage(base64ImageData);
        });
        const uploadedImageUrls = await Promise.all(imageUploadPromises);
        worker_threads_1.parentPort.postMessage(uploadedImageUrls);
    }
    catch (error) {
        worker_threads_1.parentPort.postMessage({ error: error.message });
    }
});
