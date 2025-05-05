// server/utils/accountUtils.js

/**
 * Generates a pseudo-unique account number.
 * IMPORTANT: This is a basic example. For production, ensure true uniqueness,
 * potentially by checking the database or using a more robust generation strategy (like UUIDs or database sequences).
 * @returns {string} A generated account number string.
 */
export const generateAccountNumber = () => {
    // Example format: BA + last 6 digits of timestamp + 4 random digits
    const timestampPart = Date.now().toString().slice(-6);
    const randomPart = Math.floor(1000 + Math.random() * 9000).toString();
    // Consider adding a check digit for basic validation later (Luhn algorithm?)
    return `BA${timestampPart}${randomPart}`;
  };