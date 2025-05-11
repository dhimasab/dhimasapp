const TelegramBot = require("node-telegram-bot-api");
const fs = require("fs");

// Inisialisasi bot (tanpa polling, karena webhook)
const bot = new TelegramBot(process.env.BOT_TOKEN);

// Ambil daftar grup dari file
const groups = JSON.parse(fs.readFileSync("blast-bot-js/groups.json", "utf-8"));

// ID channel pusat
const SOURCE_CHANNEL_ID = -1002541764844;

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const msg = body.channel_post || body.message;

    if (!msg) return { statusCode: 200, body: "No message received" };

    const fromChannel = msg.chat && msg.chat.id === SOURCE_CHANNEL_ID;

    // Hanya proses jika pesan berasal dari channel pusat
    if (fromChannel) {
      const messageId = msg.message_id;
      const media = msg.photo || msg.document || msg.video;
      const text = msg.text || msg.caption || "(no content)";

      for (const groupId of groups) {
        try {
          if (media) {
            // Copy media + caption dari channel ke grup
            await bot.copyMessage(groupId, SOURCE_CHANNEL_ID, messageId);
          } else {
            // Kirim teks biasa
            await bot.sendMessage(groupId, text);
          }
          console.log(`✅ Dikirim ke ${groupId}`);
        } catch (err) {
          console.error(`❌ Gagal kirim ke ${groupId}: ${err.message}`);
        }
      }

      return { statusCode: 200, body: "Forwarded from channel" };
    }

    return { statusCode: 200, body: "Not from source channel" };

  } catch (err) {
    console.error("❌ Webhook error:", err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
