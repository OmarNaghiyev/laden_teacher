/**
 * Аутентификация админки.
 *
 * Пароль НИКОГДА не попадает в клиентский код: он живёт только в переменной
 * окружения ADMIN_PASSWORD и сравнивается на сервере. После успешного входа
 * ставится httpOnly-cookie с подписанным (HMAC-SHA256) токеном, в котором нет
 * самого пароля — только срок жизни и подпись.
 *
 * Реализация на Web Crypto, чтобы работать и в Node-, и в Edge-рантайме
 * (middleware).
 */

export const SESSION_COOKIE = "laden_admin";
export const SESSION_TTL_SECONDS = 60 * 60 * 12; // 12 часов

const encoder = new TextEncoder();

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function hmac(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  return toBase64Url(new Uint8Array(signature));
}

/** Сравнение строк за постоянное время — защита от timing-атак на пароль. */
export function safeEqual(a: string, b: string): boolean {
  const aBytes = encoder.encode(a);
  const bBytes = encoder.encode(b);
  // Длины сравниваем отдельно; сам цикл всегда одной длины.
  const length = Math.max(aBytes.length, bBytes.length);
  let diff = aBytes.length ^ bBytes.length;
  for (let i = 0; i < length; i++) {
    diff |= (aBytes[i] ?? 0) ^ (bBytes[i] ?? 0);
  }
  return diff === 0;
}

export function getAdminPassword(): string | undefined {
  const password = process.env.ADMIN_PASSWORD;
  return password && password.length > 0 ? password : undefined;
}

export async function createSessionToken(secret: string): Promise<string> {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = String(expiresAt);
  const signature = await hmac(secret, payload);
  return `${payload}.${signature}`;
}

export async function verifySessionToken(
  token: string | undefined,
  secret: string | undefined,
): Promise<boolean> {
  if (!token || !secret) return false;

  const separator = token.lastIndexOf(".");
  if (separator <= 0) return false;

  const payload = token.slice(0, separator);
  const signature = token.slice(separator + 1);

  const expiresAt = Number(payload);
  if (!Number.isFinite(expiresAt)) return false;
  if (expiresAt * 1000 < Date.now()) return false;

  const expected = await hmac(secret, payload);
  return safeEqual(signature, expected);
}
