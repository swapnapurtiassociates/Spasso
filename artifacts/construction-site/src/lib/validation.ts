/**
 * Client-side validators that mirror the server rules exactly.
 * These give instant inline feedback before the form is submitted.
 */

const SYMBOL_REGEX = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/;

export function validatePassword(password: string): string | null {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters";
  if (password.length > 64) return "Password is too long";
  if (!SYMBOL_REGEX.test(password))
    return "Password must contain at least one symbol (e.g. # ! @ $ % &)";
  return null;
}

export function validatePhone(phone: string): string | null {
  if (!phone) return "Phone number is required";
  if (!/^[0-9]{10}$/.test(phone)) return "Phone number must be exactly 10 digits";
  return null;
}

export const COUNTRY_CODES = [
  { code: "+91", label: "🇮🇳 India (+91)" },
  { code: "+1",  label: "🇺🇸 USA (+1)" },
  { code: "+44", label: "🇬🇧 UK (+44)" },
  { code: "+61", label: "🇦🇺 Australia (+61)" },
  { code: "+971", label: "🇦🇪 UAE (+971)" },
  { code: "+65", label: "🇸🇬 Singapore (+65)" },
  { code: "+60", label: "🇲🇾 Malaysia (+60)" },
  { code: "+49", label: "🇩🇪 Germany (+49)" },
  { code: "+33", label: "🇫🇷 France (+33)" },
  { code: "+81", label: "🇯🇵 Japan (+81)" },
  { code: "+86", label: "🇨🇳 China (+86)" },
  { code: "+55", label: "🇧🇷 Brazil (+55)" },
  { code: "+27", label: "🇿🇦 South Africa (+27)" },
  { code: "+234", label: "🇳🇬 Nigeria (+234)" },
  { code: "+7",  label: "🇷🇺 Russia (+7)" },
];
