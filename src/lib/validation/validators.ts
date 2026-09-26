/**
 * Validation utilities for Indian Pharmaceutical & Telehealth Platform
 * Implements CDSCO, MCI, and standard RFC formats
 */

/**
 * Validates Indian 10-digit mobile number starting with 6, 7, 8, or 9.
 * Handles prefixes like +91, 91, or leading 0.
 */
export function isValidIndianPhone(phone: string): boolean {
  if (!phone) return false;
  // Remove spaces, hyphens, parentheses, and leading +91 / 91 / 0
  const cleaned = phone
    .replace(/\s+/g, "")
    .replace(/[-()]/g, "")
    .replace(/^(\+91|91|0)/, "");

  return /^[6-9]\d{9}$/.test(cleaned);
}

/**
 * Normalizes an Indian phone number to 10 digits
 */
export function normalizeIndianPhone(phone: string): string {
  return phone
    .replace(/\s+/g, "")
    .replace(/[-()]/g, "")
    .replace(/^(\+91|91|0)/, "");
}

/**
 * RFC 5322 compliant email validator
 */
export function isValidEmail(email: string): boolean {
  if (!email) return false;
  const trimmed = email.trim();
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(trimmed) && trimmed.length <= 254;
}

/**
 * Validates 6-digit Indian PIN Code.
 * Indian PIN codes cannot start with 0.
 */
export function isValidIndianPincode(pincode: string): boolean {
  if (!pincode) return false;
  const cleaned = pincode.trim().replace(/\s+/g, "");
  return /^[1-9][0-9]{5}$/.test(cleaned);
}

/**
 * Validates Indian State Medical Council / National Medical Commission Doctor Registration Number.
 * Examples: MMC-2004-49102, DMC/R/1234, 12345/MCI
 */
export function isValidDoctorRegNumber(regNo: string): boolean {
  if (!regNo) return false;
  const cleaned = regNo.trim();
  return cleaned.length >= 4 && /^[a-zA-Z0-9/.\-_ ]+$/.test(cleaned);
}

/**
 * Validates Indian UPI Virtual Payment Address (VPA).
 * Examples: name@okhdfcbank, 9876543210@paytm, user@ybl
 */
export function isValidUpiId(vpa: string): boolean {
  if (!vpa) return false;
  const cleaned = vpa.trim().toLowerCase();
  const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
  return upiRegex.test(cleaned);
}

/**
 * Validates credit/debit card numbers (13-19 digits).
 */
export function isValidCardNumber(cardNumber: string): boolean {
  if (!cardNumber) return false;
  const cleaned = cardNumber.replace(/[\s-]/g, "");
  if (!/^\d{13,19}$/.test(cleaned)) return false;

  // Luhn algorithm check
  let sum = 0;
  let shouldDouble = false;
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

/**
 * Validates card expiry MM/YY format and verifies it is not in the past.
 */
export function isValidCardExpiry(expiry: string): boolean {
  if (!expiry) return false;
  const match = expiry.trim().match(/^(0[1-9]|1[0-2])\s*\/\s*(\d{2}|\d{4})$/);
  if (!match) return false;

  const month = parseInt(match[1], 10);
  let year = parseInt(match[2], 10);
  if (year < 100) year += 2000;

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1-12

  if (year < currentYear) return false;
  if (year === currentYear && month < currentMonth) return false;
  return year <= currentYear + 25;
}

/**
 * Validates card CVV (3 digits for RuPay/Visa/MasterCard, 4 digits for Amex).
 */
export function isValidCardCvv(cvv: string): boolean {
  if (!cvv) return false;
  const cleaned = cvv.trim();
  return /^\d{3,4}$/.test(cleaned);
}

/**
 * Validates prescription file type and size (max 15MB)
 */
export function isValidPrescriptionFile(file: { name: string; size?: number }): {
  valid: boolean;
  error?: string;
} {
  const allowedExtensions = [".jpg", ".jpeg", ".png", ".pdf", ".webp"];
  const fileName = file.name.toLowerCase();
  const hasValidExt = allowedExtensions.some((ext) => fileName.endsWith(ext));

  if (!hasValidExt) {
    return {
      valid: false,
      error: "Please upload a valid JPEG, PNG, WEBP, or PDF prescription file.",
    };
  }

  if (file.size && file.size > 15 * 1024 * 1024) {
    return {
      valid: false,
      error: "File size exceeds 15MB limit. Please upload a compressed copy.",
    };
  }

  return { valid: true };
}
