import { NextResponse } from "next/server";

import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { buildTelegramMessage, sendTelegramNotification } from "@/lib/telegram";
import { validateApplication } from "@/lib/validation";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const result = validateApplication(body);
  if (!result.ok) {
    return NextResponse.json({ error: "validation", fields: result.errors }, { status: 422 });
  }

  if (!isSupabaseConfigured()) {
    console.error("[applications] Supabase не настроен — заявка не сохранена.");
    return NextResponse.json({ error: "not_configured" }, { status: 500 });
  }

  const { error } = await getSupabase().from("applications").insert(result.data);

  if (error) {
    console.error("[applications] Ошибка записи в Supabase:", error.message);
    return NextResponse.json({ error: "db" }, { status: 500 });
  }

  // Уведомление отправляем после сохранения. Если Telegram недоступен, заявка
  // всё равно сохранена — ученику показываем успех.
  const notified = await sendTelegramNotification(buildTelegramMessage(result.data));

  return NextResponse.json({ ok: true, notified }, { status: 201 });
}
