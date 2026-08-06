import { cookies } from "next/headers";

import { SESSION_COOKIE, getAdminPassword, verifySessionToken } from "@/lib/auth";

/** Дублирует проверку из proxy.ts - на случай изменения его матчера. */
export async function isAdminAuthenticated(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  return verifySessionToken(token, getAdminPassword());
}
