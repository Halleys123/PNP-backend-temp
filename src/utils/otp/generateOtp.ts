import { checkPasswords, hashPassword } from '@himanshu_guptaorg/utils';
/**
 * Generates a random OTP (One Time Password) with the specified number of digits.
 *
 * @param n - The number of digits for the OTP.
 * @returns A string representing the generated OTP.
 */
const generateOTP = (n: number): string => {
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
const getOtp = async (
  n: number
): Promise<{
  hashedOtp: string;
  generatedOtp: string;
}> => {
  const otp = generateOTP(n);
  return { hashedOtp: await hashPassword(otp), generatedOtp: otp };
};

/**
 * Checks if the entered OTP matches the hashed OTP stored in the database.
 *
 * @param enteredOtp - The OTP entered by the user.
 * @param dataBaseOtp - The hashed OTP stored in the database.
 * @returns A boolean indicating if the OTPs match.
 */
const checkOtp = async (
  enteredOtp: string,
  dataBaseOtp: string
): Promise<boolean> => {
  return await checkPasswords(enteredOtp, dataBaseOtp);
};

export { getOtp, checkOtp };
