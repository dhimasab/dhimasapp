const TelegramBot = require("node-telegram-bot-api");

// Inisialisasi bot TANPA polling, karena kita pakai webhook
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: false });

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    console.log("📨 Webhook called!");
    console.log("🔍 Full Payload:", JSON.stringify(body, null, 2));

    const msg = body.message || body.channel_post;
    if (!msg) {
      console.log("⚠️ No message or channel_post in payload.");
      return { statusCode: 200, body: "No message received" };
    }

    const chatId = msg.chat.id;
    const text = msg.text || msg.caption || "(no text)";

    // Balas ke grup/channel
    await bot.sendMessage(chatId, `✅ Pesan diterima: "${text}"`);

    return {
      statusCode: 200,
      body: JSON.stringify({ status: "ok" }),
    };
  } catch (err) {
    console.error("❌ Error:", err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
