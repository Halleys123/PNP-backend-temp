"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkOtp = exports.getOtp = void 0;
const utils_1 = require("@himanshu_guptaorg/utils");
/**
 * Generates a random OTP (One Time Password) with the specified number of digits.
 *
 * @param n - The number of digits for the OTP.
 * @returns A string representing the generated OTP.
 */
const generateOTP = (n) => {
    if (n <= 0) {
        throw new Error('The number of digits must be greater than zero.');
    }
    const min = Math.pow(10, n - 1);
    const max = Math.pow(10, n) - 1;
    const otp = Math.floor(Math.random() * (max - min + 1)) + min;
    return otp.toString();
};
/**
 * Generates a hashed OTP with the specified number of digits.
 *
 * @param n - The number of digits for the OTP.
 * @returns An object containing the generated OTP and its hashed version.
 */
const getOtp = async (n) => {
    const otp = generateOTP(n);
    return { hashedOtp: await (0, utils_1.hashPassword)(otp), generatedOtp: otp };
};
exports.getOtp = getOtp;
/**
 * Checks if the entered OTP matches the hashed OTP stored in the database.
 *
 * @param enteredOtp - The OTP entered by the user.
 * @param dataBaseOtp - The hashed OTP stored in the database.
 * @returns A boolean indicating if the OTPs match.
 */
const checkOtp = async (enteredOtp, dataBaseOtp) => {
    return await (0, utils_1.checkPasswords)(enteredOtp, dataBaseOtp);
};
exports.checkOtp = checkOtp;
