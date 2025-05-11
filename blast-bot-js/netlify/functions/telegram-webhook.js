const TelegramBot = require("node-telegram-bot-api");
const fs = require("fs");

const bot = new TelegramBot(process.env.BOT_TOKEN); // tanpa polling
const groups = JSON.parse(fs.readFileSync("blast-bot-js/groups.json", "utf-8"));

// ID channel pusat kamu
const SOURCE_CHANNEL_ID = -1001234567890; // ganti sesuai channel kamu

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const msg = body.message || body.channel_post;

    if (!msg) return { statusCode: 200, body: "No message received" };

    // Jika pesan dari channel pusat, lakukan blast
    if (msg.chat && msg.chat.id === SOURCE_CHANNEL_ID) {
      const text = msg.text || msg.caption || "(no content)";
      const media = msg.photo || msg.document;

      for (const groupId of groups) {
        try {
          if (media) {
            const fileId = media[media.length - 1].file_id || media.file_id;
            await bot.copyMessage(groupId, SOURCE_CHANNEL_ID, msg.message_id);
          } else {
            await bot.sendMessage(groupId, text);
          }
          console.log(`✅ Forward sukses ke ${groupId}`);
        } catch (err) {
          console.error(`❌ Gagal forward ke ${groupId}: ${err.message}`);
        }
      }

      return { statusCode: 200, body: "Forwarded" };
    }

    // Kalau bukan dari channel, abaikan
    return { statusCode: 200, body: "Not from source channel" };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
