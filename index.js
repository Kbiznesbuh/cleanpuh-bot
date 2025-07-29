import { Telegraf } from "telegraf";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) =>
  ctx.reply("Привет! Я бот мастерской «Чистый Пух». Задавайте вопросы по реставрации и изготовлению подушек и одеял.")
);

bot.on("text", async (ctx) => {
  const userMessage = ctx.message.text;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Ты консультант мастерской 'Чистый Пух'. Отвечай кратко, по делу, уточняй детали при необходимости. Если не уверен, предложи связаться с мастером.",
          },
          { role: "user", content: userMessage },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data.choices[0].message.content;
    ctx.reply(reply);
  } catch (err) {
    ctx.reply("Ошибка при подключении к ИИ. Попробуйте позже.");
    console.error(err);
  }
});

bot.launch();
console.log("Бот запущен!");
