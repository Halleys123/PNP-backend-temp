"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrders = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
const orders_1 = require("../../../../models/orders/schema/orders");
const getOrders = (0, utils_1.async_error_handler)(async (req, res, next) => {
    const { pageNo = 1, pageSize = 10, from, to, isDelivered, deliveryStatus, orderStatus, orderType, } = req.query;
    let parsedPageNo = parseInt(pageNo.toString());
    let parsedPageSize = parseInt(pageSize.toString());
    const filters = {};
    if (deliveryStatus)
        filters['deliveryStatus'] = deliveryStatus;
    if (from)
        filters['startTime'] = { $gte: new Date(from.toString()) };
    if (to) {
        if (filters['startTime'])
            filters['startTime']['$lte'] = new Date(to.toString());
        else
            filters['startTime'] = { $lte: new Date(to.toString()) };
    }
    if (isDelivered) {
        if (isDelivered == 'true')
            filters['isDroppedCompletely'] = true;
        else if (isDelivered == 'false')
            filters['isDroppedCompletely'] = false;
    }
    if (orderStatus) {
        filters['orderStatus'] = orderStatus.toString();
    }
    if (orderType)
        filters['orderType'] = orderType;
    const filteredOrders = await orders_1.OrderModel.find(filters);
    const length = filteredOrders.length;
    const paginatedOrders = filteredOrders.splice((parsedPageNo - 1) * parsedPageSize, parsedPageSize);
    const response = new utils_1.Custom_response(true, null, { orders: paginatedOrders, totalOrders: length }, 'success', 200, null);
    res.status(response.statusCode).json(response);
});
exports.getOrders = getOrders;
