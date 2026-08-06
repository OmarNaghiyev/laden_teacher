import { getDict } from "@/lib/i18n";
import type { ApplicationInput } from "@/lib/validation";

/** Под parse_mode=HTML. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Всегда по-русски, независимо от языка сайта, на котором заполнялась заявка. */
export function buildTelegramMessage(data: ApplicationInput): string {
  const d = getDict("ru");
  const f = d.form.fields;

  const who =
    data.status === "pupil"
      ? `${f.status.options.pupil}, ${data.grade} ${f.grade.suffix}`
      : data.status === "student"
        ? f.status.options.student
        : f.status.options.adult;

  const goal =
    data.goal === "other"
      ? `${f.goal.options.other}: ${data.goal_other ?? ""}`
      : f.goal.options[data.goal];

  const experience = data.studied_before
    ? `${f.studiedBefore.yes} — ${data.studied_details ?? ""}`
    : f.studiedBefore.no;

  const lines: string[] = [
    "<b>🎓 Новая заявка на занятия</b>",
    "",
    `<b>Имя:</b> ${escapeHtml(data.name)}`,
    `<b>Контакт:</b> ${escapeHtml(data.contact)}`,
    `<b>Кто учится:</b> ${escapeHtml(who)}`,
    `<b>Опыт:</b> ${escapeHtml(experience)}`,
    `<b>Уровень:</b> ${escapeHtml(f.level.options[data.level])}`,
    `<b>Цель:</b> ${escapeHtml(goal)}`,
    `<b>Формат:</b> ${escapeHtml(f.format.options[data.format])}`,
    `<b>Удобное время:</b> ${escapeHtml(data.preferred_time ?? "—")}`,
    `<b>Комментарий:</b> ${escapeHtml(data.comment ?? "—")}`,
    "",
    `<i>Язык заявки: ${data.lang === "az" ? "азербайджанский" : "русский"}</i>`,
  ];

  return lines.join("\n");
}

/** Не бросает: заявка уже в БД, отказ Telegram не должен ломать ответ ученику. */
export async function sendTelegramNotification(text: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn(
      "[telegram] TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID не заданы — уведомление не отправлено.",
    );
    return false;
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      console.error(`[telegram] sendMessage ${response.status}: ${body}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error("[telegram] Ошибка отправки:", error);
    return false;
  }
}
