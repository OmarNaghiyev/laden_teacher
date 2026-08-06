import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/AdminShell";
import { ApplicationsTable } from "@/components/admin/ApplicationsTable";
import { isAdminAuthenticated } from "@/lib/admin-guard";
import { getDict } from "@/lib/i18n";
import {
  getSupabase,
  isSupabaseConfigured,
  type ApplicationRow,
} from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function AdminApplicationsPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const dict = getDict("ru");
  let rows: ApplicationRow[] = [];
  let dbError: string | null = null;

  if (!isSupabaseConfigured()) {
    dbError = "Supabase не настроен: задайте SUPABASE_URL и ключ в переменных окружения.";
  } else {
    const { data, error } = await getSupabase()
      .from("applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[admin] Ошибка чтения заявок:", error.message);
      dbError = error.message;
    } else {
      rows = (data ?? []) as ApplicationRow[];
    }
  }

  return (
    <AdminShell dict={dict} active="applications">
      {dbError ? (
        <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {dbError}
        </p>
      ) : (
        <ApplicationsTable dict={dict} initialRows={rows} />
      )}
    </AdminShell>
  );
}
