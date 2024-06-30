"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryStatus = exports.productVerificationStatus = exports.descriptionType = exports.OrderType = exports.roles = exports.TransactionStatus = exports.OrderStatus = exports.accountType = exports.ProductCategory = exports.ProductStatus = void 0;
var ProductStatus;
(function (ProductStatus) {
    ProductStatus["SOLD"] = "sold";
    ProductStatus["SELLING_IN_PROCESS"] = "sellingInProcess";
    ProductStatus["NOT_SOLD"] = "notSold";
})(ProductStatus || (exports.ProductStatus = ProductStatus = {}));
var ProductCategory;
(function (ProductCategory) {
    ProductCategory["PLANT"] = "plant";
    ProductCategory["POT"] = "pot";
})(ProductCategory || (exports.ProductCategory = ProductCategory = {}));
var accountType;
(function (accountType) {
    accountType["INDIVIDUAL"] = "individual";
    accountType["BUSINESS"] = "business";
})(accountType || (exports.accountType = accountType = {}));
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PROCESSED"] = "processed";
    OrderStatus["PENDING"] = "pending";
    OrderStatus["FAILED"] = "failed";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["PENDING"] = "pending";
    TransactionStatus["COMPLETED"] = "completed";
    TransactionStatus["FAILED"] = "failed";
    TransactionStatus["REFUNDED"] = "refunded";
})(TransactionStatus || (exports.TransactionStatus = TransactionStatus = {}));
var roles;
(function (roles) {
    roles["BUYER"] = "buyer";
    roles["SELLER"] = "seller";
    roles["ADMIN"] = "admin";
})(roles || (exports.roles = roles = {}));
var OrderType;
(function (OrderType) {
    OrderType["ONLINE_PAYMENT"] = "onlinePayment";
    OrderType["CASH_ON_DELIVERY"] = "cashOnDelivery";
})(OrderType || (exports.OrderType = OrderType = {}));
var descriptionType;
(function (descriptionType) {
    descriptionType["DESCRIPTION"] = "description";
    descriptionType["BULLET"] = "points";
})(descriptionType || (exports.descriptionType = descriptionType = {}));
var productVerificationStatus;
(function (productVerificationStatus) {
    productVerificationStatus["PENDING"] = "pending";
    productVerificationStatus["ACCEPTED"] = "accepted";
    productVerificationStatus["REJECTED"] = "rejected";
})(productVerificationStatus || (exports.productVerificationStatus = productVerificationStatus = {}));
var DeliveryStatus;
(function (DeliveryStatus) {
    DeliveryStatus["ON_THE_GO"] = "onTheGo";
    DeliveryStatus["NOT_INITIATED"] = "notInitiated";
    DeliveryStatus["DELIVERED"] = "delivered";
})(DeliveryStatus || (exports.DeliveryStatus = DeliveryStatus = {}));
