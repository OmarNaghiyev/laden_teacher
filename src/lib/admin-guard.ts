import { cookies } from "next/headers";

import { SESSION_COOKIE, getAdminPassword, verifySessionToken } from "@/lib/auth";

/**
 * Проверка админской сессии внутри Server Component / Route Handler.
 * Middleware уже отсекает неавторизованные запросы к /admin и /api/admin/*,
 * но каждый защищённый обработчик проверяет сессию сам — на случай изменения
 * матчера middleware.
 */
export async function isAdminAuthenticated(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  return verifySessionToken(token, getAdminPassword());
}
