const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[6-9]\d{9}$/;

export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export function normalizePhone(value: string) {
  return value.replace(/\D/g, "");
}

export function validateSignupInput(input: {
  username?: string;
  email?: string;
  phone?: string;
  password?: string;
}) {
  const username = input.username?.trim() ?? "";
  const email = normalizeEmail(input.email ?? "");
  const phone = normalizePhone(input.phone ?? "");
  const password = input.password ?? "";

  if (username.length < 2 || username.length > 80) {
    return { error: "Username must be between 2 and 80 characters." };
  }

  if (!EMAIL_REGEX.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  if (!PHONE_REGEX.test(phone)) {
    return { error: "Please enter a valid 10-digit Indian phone number." };
  }

  if (password.length < 8 || password.length > 128) {
    return { error: "Password must be between 8 and 128 characters." };
  }

  return { username, email, phone, password };
}

export function validateLoginInput(input: {
  identifier?: string;
  password?: string;
}) {
  const identifier = (input.identifier ?? "").trim().toLowerCase();
  const password = input.password ?? "";

  if (!identifier || !password) {
    return { error: "Email/phone and password are required." };
  }

  return { identifier, password };
}
