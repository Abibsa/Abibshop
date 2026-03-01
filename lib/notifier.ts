export async function sendAdminNotification(message: string) {
    console.log("NOTIF TO ADMIN:", message);

    // Telegram Bot Integration (Mudah untuk MVP)
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (token && chatId) {
        try {
            await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message,
                    parse_mode: "HTML"
                }),
            });
        } catch (e) {
            console.error("Failed to send telegram notification", e);
        }
    }
}
