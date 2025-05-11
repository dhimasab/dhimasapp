const TelegramBot = require("node-telegram-bot-api");

const bot = new TelegramBot(process.env.BOT_TOKEN); // tidak polling

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const msg = body.message || body.channel_post;

    if (!msg) {
      return { statusCode: 200, body: "No message received" };
    }

    const chatId = msg.chat.id;
    const text = msg.text || msg.caption || "(no text)";

    // Kirim balasan atau echo sebagai tes
    await bot.sendMessage(chatId, `✅ Pesan diterima: "${text}"`);

    return {
      statusCode: 200,
      body: JSON.stringify({ status: "ok" }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
