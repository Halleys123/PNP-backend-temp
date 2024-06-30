"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageProcessorFunction = imageProcessorFunction;
const worker_threads_1 = require("worker_threads");
const path_1 = __importDefault(require("path"));
const products_1 = require("../../../../../models/products/schema/products");
function imageProcessorFunction(images, productId) {
    const worker = new worker_threads_1.Worker(path_1.default.resolve(__dirname, 'imageWorker.ts'));
    worker.postMessage(images);
    worker.on('message', async (result) => {
        console.log(result);
        if (result.error) {
        }
        else {
            try {
                console.log(JSON.stringify(productId));
                console.log(await products_1.ProductModel.findById(productId));
                const pro = await products_1.ProductModel.findByIdAndUpdate(productId, {
                    $set: { images: result },
                });
                console.log(pro);
            }
            catch (e) {
                console.log(e);
            }
        }
    });
    worker.on('error', (error) => { });
    worker.on('exit', (code) => {
        if (code !== 0) {
        }
    });
}
