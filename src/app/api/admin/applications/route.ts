import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin-guard";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

export async function PATCH(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "not_configured" }, { status: 500 });
  }

  let id = "";
  let status = "";
  try {
    const body = (await request.json()) as { id?: unknown; processing_status?: unknown };
    id = typeof body.id === "string" ? body.id : "";
    status = typeof body.processing_status === "string" ? body.processing_status : "";
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  if (!id || (status !== "pending" && status !== "processed")) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const { error } = await getSupabase()
    .from("applications")
    .update({ processing_status: status })
    .eq("id", id);

  if (error) {
    console.error("[admin/applications] Ошибка обновления:", error.message);
    return NextResponse.json({ error: "db" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
