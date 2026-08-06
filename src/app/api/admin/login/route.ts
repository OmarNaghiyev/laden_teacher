import { NextResponse } from "next/server";

import {
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
  createSessionToken,
  getAdminPassword,
  safeEqual,
} from "@/lib/auth";

/**
 * Проверка пароля целиком на сервере. Клиент отправляет введённый пароль,
 * получает обратно только httpOnly-cookie или ошибку — сам пароль недоступен
 * из клиентского JS и не попадает в исходный код страницы.
 */
export async function POST(request: Request) {
  const expected = getAdminPassword();
  if (!expected) {
    return NextResponse.json({ error: "not_configured" }, { status: 500 });
  }

  let submitted = "";
  try {
    const body = (await request.json()) as { password?: unknown };
    submitted = typeof body.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  if (!safeEqual(submitted, expected)) {
    return NextResponse.json({ error: "wrong_password" }, { status: 401 });
  }

  const token = await createSessionToken(expected);

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });

  return response;
}
