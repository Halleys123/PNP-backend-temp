"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deliveryRouter = void 0;
const delivery_1 = require("./delivery");
const deliveryDone_1 = require("./deliveryDone");
const router = require('express').Router();
exports.deliveryRouter = router;
router.route('/initiateDelivery').post(delivery_1.initiateDelivery);
router.route('/deliveryCompleted').post(deliveryDone_1.deliveryDone);
