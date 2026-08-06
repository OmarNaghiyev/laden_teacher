import { LoginForm } from "@/components/admin/LoginForm";
import { getDict } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  const dict = getDict("ru");

  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <h1 className="text-xl font-bold text-ink">{dict.admin.loginTitle}</h1>
        <p className="mt-1.5 text-sm text-ink-soft">{dict.admin.loginLead}</p>
        <LoginForm dict={dict} />
      </div>
    </main>
  );
}
