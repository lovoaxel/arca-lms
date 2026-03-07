const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = "8295150710";

export async function sendTelegramAlert(message: string): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN) {
    console.warn("[ARCA] TELEGRAM_BOT_TOKEN not set, skipping alert");
    return false;
  }

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "HTML",
      }),
    });

    if (!res.ok) {
      console.error("[ARCA] Telegram alert failed:", res.statusText);
      return false;
    }

    return true;
  } catch (error) {
    console.error("[ARCA] Telegram alert error:", error);
    return false;
  }
}
