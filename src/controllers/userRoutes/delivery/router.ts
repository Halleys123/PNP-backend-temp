import { initiateDelivery } from './delivery';
import { deliveryDone } from './deliveryDone';

const router = require('express').Router();
router.route('/initiateDelivery').post(initiateDelivery);
router.route('/deliveryCompleted').post(deliveryDone);
export { router as deliveryRouter };
