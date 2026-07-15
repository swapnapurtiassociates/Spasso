/**
 * Password rules:
 * - Minimum 8 characters (and capped at 64 to avoid abuse)
 * - At least one symbol/special character (e.g. # ! @ $ % etc.)
 */
const SYMBOL_REGEX = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/;

export function validatePassword(password) {
  if (typeof password !== "string") {
    return "Password is required";
  }
  if (password.length < 8) {
    return "Password must be at least 8 characters long";
  }
  if (password.length > 64) {
    return "Password must be at most 64 characters long";
  }
  if (!SYMBOL_REGEX.test(password)) {
    return "Password must contain at least one symbol (e.g. # ! @ $ % &)";
  }
  return null;
}

/**
 * Phone number rules:
 * - Exactly 10 digits (country code is stored separately)
 */
const PHONE_REGEX = /^[0-9]{10}$/;

export function validatePhone(phone) {
  if (!phone) return "Phone number is required";
  if (!PHONE_REGEX.test(phone)) {
    return "Phone number must be exactly 10 digits";
  }
  return null;
}

/**
 * Country code rules: must start with "+" followed by 1-3 digits.
 */
const COUNTRY_CODE_REGEX = /^\+[0-9]{1,3}$/;

export function validateCountryCode(code) {
  if (!code) return "Country code is required";
  if (!COUNTRY_CODE_REGEX.test(code)) {
    return "Invalid country code";
  }
  return null;
}

/**
 * Email rules: standard, pragmatic RFC-5322-ish check (not exhaustive,
 * intentionally permissive so real-world addresses aren't rejected).
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email) {
  if (!email || typeof email !== "string") return "Email is required";
  if (email.length > 150) return "Email must be at most 150 characters long";
  if (!EMAIL_REGEX.test(email)) return "Please enter a valid email address";
  return null;
}

/**
 * Phone rules for public enquiry forms: more lenient than the strict
 * 10-digit signup rule, since enquiries may come from any country.
 * Accepts an optional leading "+" and 7-15 digits, allowing spaces,
 * dashes, and parentheses as separators.
 */
const ENQUIRY_PHONE_REGEX = /^\+?[0-9\s\-()]{7,20}$/;

export function validateEnquiryPhone(phone) {
  if (!phone || typeof phone !== "string") return "Phone number is required";
  const digitCount = phone.replace(/[^0-9]/g, "").length;
  if (digitCount < 7 || digitCount > 15) {
    return "Phone number must contain between 7 and 15 digits";
  }
  if (!ENQUIRY_PHONE_REGEX.test(phone)) {
    return "Please enter a valid phone number";
  }
  return null;
}
