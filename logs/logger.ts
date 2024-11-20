import { createLogger } from "winston";
import TelegramLogger from "winston-telegram";

const chatId = parseInt(process.env.TELEGRAM_CHAT_ID || "0");
const token = process.env.TELEGRAM_BOT_TOKEN || "";

const logger = createLogger();

if (chatId && token) {
  logger.add(
    new TelegramLogger({
      chatId,
      token,
    })
  );
} else {
  console.error("Telegram chatId or token not provided");
}

export default logger;
