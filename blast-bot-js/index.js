require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const fs = require("fs");

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: false });

const groups = JSON.parse(fs.readFileSync("groups.json", "utf-8"));

const imageUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/800px-Bitcoin.svg.png";
const caption = "📷 Ini gambar Bitcoin dari URL!";

groups.forEach(async (groupId) => {
  try {
    const chat = await bot.getChat(groupId);
    await bot.sendPhoto(groupId, imageUrl, { caption });
    console.log(`✅ Gambar dikirim ke '${chat.title}' (${groupId})`);
  } catch (e) {
    console.error(`❌ Gagal kirim ke ${groupId}: ${e.message}`);
  }
});
