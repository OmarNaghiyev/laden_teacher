import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/AdminShell";
import { AvailabilityEditor } from "@/components/admin/AvailabilityEditor";
import { isAdminAuthenticated } from "@/lib/admin-guard";
import { fetchAvailability } from "@/lib/availability";
import { getDict } from "@/lib/i18n";
import { isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function AdminAvailabilityPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const dict = getDict("ru");
  const configured = isSupabaseConfigured();
  const rows = configured ? await fetchAvailability() : [];

  return (
    <AdminShell dict={dict} active="availability">
      {configured ? (
        <AvailabilityEditor dict={dict} initialRows={rows} />
      ) : (
        <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          Supabase не настроен: задайте SUPABASE_URL и ключ в переменных окружения.
        </p>
      )}
    </AdminShell>
  );
}
