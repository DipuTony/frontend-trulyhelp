// const { maskEmail, maskPhone, maskName } = require('./maskUtils');

// // Example usage:
// console.log(maskEmail('john.doe@gmail.com')); // "j***@gmail.com"
// console.log(maskPhone('+1234567890'));       // "+1******890"
// console.log(maskName('John Doe'));           // "J*** D***"
// console.log(maskDate('1990-05-15'));         // "****-**-15"
// console.log(maskCardNumber('4111111111111111')); // "************1111"
// console.log(maskAddress('123 Main Street'));  // "*** Main Street"

/**
 * Utility functions for masking sensitive data.
 */

/**
 * Masks an email address with the following rules:
 * - Hides last 4 characters before @ (e.g., "john.doe@gmail.com" → "jo****@gmail.com")
 * - If username has ≤4 characters, shows only first character (e.g., "joe@x.com" → "j***@x.com")
 * @param {string} email - The email to mask
 * @returns {string} Masked email
 */
export function maskEmail(email) {
    if (!email || typeof email !== 'string') return '';

    const [username, domain] = email.split('@');
    if (!username || !domain) return email;

    if (username.length <= 4) {
        // For short usernames: show first character only
        return `${username[0]}***@${domain}`;
    } else {
        // For longer usernames: hide last 4 characters
        const visiblePart = username.slice(0, -3);
        return `${visiblePart}****@${domain}`;
    }
}

/**
 * Masks a phone number (e.g., "+1234567890" → "+1******890")
 * @param {string} phone - The phone number to mask.
 * @param {number} [visibleDigits=3] - Number of digits to keep visible at the end.
 * @returns {string} Masked phone number.
 */
export function maskPhone(phone, visibleDigits = 3) {
    if (!phone || typeof phone !== 'string') return '';
    if (phone.length <= visibleDigits) return phone;
    const maskedPart = phone.slice(0, -visibleDigits).replace(/./g, '*');
    const lastDigits = phone.slice(-visibleDigits);
    return maskedPart + lastDigits;
}

/**
 * Masks a name (e.g., "John Doe" → "J*** D***")
 * @param {string} name - The name to mask.
 * @returns {string} Masked name.
 */
export function maskName(name) {
    if (!name || typeof name !== 'string') return '';
    return name
        .split(' ')
        .map(word => (word.length > 1 ? `${word[0]}${'*'.repeat(word.length - 1)}` : word))
        .join(' ');
}

/**
 * Masks a date (e.g., "1990-05-15" → "****-**-15")
 * @param {string} date - The date string (format: YYYY-MM-DD).
 * @param {boolean} [hideYear=true] - Whether to hide the year.
 * @returns {string} Masked date.
 */
export function maskDate(date, hideYear = true) {
    if (!date || typeof date !== 'string') return '';
    const [year, month, day] = date.split('-');
    if (!year || !month || !day) return date;
    return `${hideYear ? '****' : year}-${'**'}-${day}`;
}

/**
 * Masks a credit card number (e.g., "4111111111111111" → "************1111")
 * @param {string} cardNumber - The card number to mask.
 * @param {number} [visibleDigits=4] - Digits to keep visible at the end.
 * @returns {string} Masked card number.
 */
export function maskCardNumber(cardNumber, visibleDigits = 4) {
    if (!cardNumber || typeof cardNumber !== 'string') return '';
    if (cardNumber.length <= visibleDigits) return cardNumber;
    return cardNumber.slice(-visibleDigits).padStart(cardNumber.length, '*');
}

/**
 * Masks an address (e.g., "123 Main St" → "*** Main St")
 * @param {string} address - The address to mask.
 * @param {number} [visibleParts=1] - Number of parts (split by space) to keep unmasked.
 * @returns {string} Masked address.
 */
export function maskAddress(address, visibleParts = 1) {
    if (!address || typeof address !== 'string') return '';
    const parts = address.split(' ');
    if (parts.length <= visibleParts) return address;
    const masked = parts
        .slice(0, -visibleParts)
        .map(part => '*'.repeat(part.length));
    return [...masked, ...parts.slice(-visibleParts)].join(' ');
}
