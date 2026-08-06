import { NextResponse, type NextRequest } from "next/server";

import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import { DEFAULT_LANG, LANGS } from "@/lib/i18n";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    const preferred = pickLanguage(request);
    const url = request.nextUrl.clone();
    url.pathname = `/${preferred}`;
    return NextResponse.redirect(url);
  }

  const isAdminPage = pathname === "/admin" || pathname.startsWith("/admin/");
  const isAdminApi = pathname.startsWith("/api/admin/");

  const isPublicAdminRoute =
    pathname === "/admin/login" ||
    pathname === "/api/admin/login" ||
    pathname === "/api/admin/logout";

  if ((isAdminPage || isAdminApi) && !isPublicAdminRoute) {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const authenticated = await verifySessionToken(token, process.env.ADMIN_PASSWORD);

    if (!authenticated) {
      if (isAdminApi) {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 });
      }
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

function pickLanguage(request: NextRequest): string {
  const header = request.headers.get("accept-language")?.toLowerCase() ?? "";

  const best = LANGS.map((lang) => ({ lang, index: header.indexOf(lang) }))
    .filter((candidate) => candidate.index !== -1)
    .sort((a, b) => a.index - b.index)[0];

  return best?.lang ?? DEFAULT_LANG;
}

export const config = {
  matcher: ["/", "/admin", "/admin/:path*", "/api/admin/:path*"],
};
