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
exports.imageProcessorFunction = imageProcessorFunction;
const worker_threads_1 = require("worker_threads");
const path_1 = __importDefault(require("path"));
const products_1 = require("../../../../../models/products/schema/products");
function imageProcessorFunction(images, productId) {
    const worker = new worker_threads_1.Worker(path_1.default.resolve(__dirname, 'imageWorker.ts'));
    worker.postMessage(images);
    worker.on('message', (result) => __awaiter(this, void 0, void 0, function* () {
        console.log(result);
        if (result.error) {
        }
        else {
            try {
                console.log(JSON.stringify(productId));
                console.log(yield products_1.ProductModel.findById(productId));
                const pro = yield products_1.ProductModel.findByIdAndUpdate(productId, {
                    $set: { images: result },
                });
                console.log(pro);
            }
            catch (e) {
                console.log(e);
            }
        }
    }));
    worker.on('error', (error) => { });
    worker.on('exit', (code) => {
        if (code !== 0) {
        }
    });
}
