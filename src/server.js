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
exports.index = exports.razorpayInstance = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: "secrets.env" });
dotenv_1.default.config({ path: "config.env" });
const app_1 = require("./app");
const mongoose_1 = __importDefault(require("mongoose"));
const utils_1 = require("@himanshu_guptaorg/utils");
const startSocket_1 = require("./startSocket");
const razorpay_1 = __importDefault(require("razorpay"));
const razorpayInstance = new razorpay_1.default({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});
exports.razorpayInstance = razorpayInstance;
const algoliasearch_1 = __importDefault(require("algoliasearch"));
const client = (0, algoliasearch_1.default)(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_WRITE_API_KEY);
console.log(process.env.PORT);
const index = client.initIndex("products");
exports.index = index;
// const IP = "192.168.29.122";
// const PORT: number = process.env.PORT * 1 || 3000;
const init = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!process.env.MONGO_URI)
            throw new utils_1.Custom_error({
                errors: [{ message: "MONGO_URINotFound" }],
                statusCode: 500,
            });
        yield mongoose_1.default.connect(process.env.MONGO_URI);
        console.log(process.env.MONGO_URI);
        app_1.app.listen(3000, "192.168.29.122", () => __awaiter(void 0, void 0, void 0, function* () {
            console.log("Server started!!!!!!");
        }));
        (0, startSocket_1.startSocket)();
    }
    catch (err) {
        console.error(err);
    }
});
init();
