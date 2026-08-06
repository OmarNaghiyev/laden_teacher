import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin-guard";
import { LANGS } from "@/lib/i18n";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { validateAvailability } from "@/lib/validation";

/** Сбрасывает ISR-кэш, иначе календарь обновится только через revalidate-интервал. */
function revalidatePublicPages() {
  for (const lang of LANGS) revalidatePath(`/${lang}`);
}

async function guard() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "not_configured" }, { status: 500 });
  }
  return null;
}

export async function POST(request: Request) {
  const blocked = await guard();
  if (blocked) return blocked;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const result = validateAvailability(body);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 422 });
  }

  // .single() - клиенту нужен id новой строки, чтобы показать её без перезагрузки.
  const { data, error } = await getSupabase()
    .from("availability")
    .insert(result.data)
    .select()
    .single();

  if (error) {
    console.error("[admin/availability] Ошибка вставки:", error.message);
    return NextResponse.json({ error: "db" }, { status: 500 });
  }

  revalidatePublicPages();
  return NextResponse.json({ ok: true, row: data }, { status: 201 });
}

export async function DELETE(request: Request) {
  const blocked = await guard();
  if (blocked) return blocked;

  let id = "";
  try {
    const body = (await request.json()) as { id?: unknown };
    id = typeof body.id === "string" ? body.id : "";
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  if (!id) return NextResponse.json({ error: "bad_request" }, { status: 400 });

  const { error } = await getSupabase().from("availability").delete().eq("id", id);
  if (error) {
    console.error("[admin/availability] Ошибка удаления:", error.message);
    return NextResponse.json({ error: "db" }, { status: 500 });
  }

  revalidatePublicPages();
  return NextResponse.json({ ok: true });
}
