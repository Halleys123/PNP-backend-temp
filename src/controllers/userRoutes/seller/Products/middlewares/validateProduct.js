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
exports.validateProduct = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const validateDescription = (description) => {
    if (!Array.isArray(description))
        return false;
    for (const desc of description) {
        if (typeof desc.heading !== 'string')
            return false;
        if (!Array.isArray(desc.info))
            return false;
        for (const info of desc.info) {
            if (typeof info.descriptionType !== 'string')
                return false;
            if (!Array.isArray(info.value))
                return false;
            if (!info.value.every((val) => typeof val === 'string'))
                return false;
        }
    }
    return true;
};
const validateProduct = (0, utils_1.async_error_handler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description = '', price, category, stock = 1, images = [], tags, } = req.body;
    if (!name) {
        throw new utils_1.Custom_error({
            errors: [{ message: 'sendName' }],
            statusCode: 400,
        });
    }
    if (!price) {
        throw new utils_1.Custom_error({
            errors: [{ message: 'sendPrice' }],
            statusCode: 400,
        });
    }
    if (!category) {
        throw new utils_1.Custom_error({
            errors: [{ message: 'categoryMustBeProvided' }],
            statusCode: 400,
        });
    }
    if (!description) {
        throw new utils_1.Custom_error({
            errors: [{ message: 'descriptionRequired' }],
            statusCode: 400,
        });
    }
    if (!validateDescription(description)) {
        throw new utils_1.Custom_error({
            errors: [{ message: 'invalidDescriptionFormat' }],
            statusCode: 400,
        });
    }
    next();
}));
exports.validateProduct = validateProduct;
