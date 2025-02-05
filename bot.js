const { Telegraf } = require("telegraf");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const bot = new Telegraf(process.env.BOT_API);

// Predefined Answers
const predefinedAnswers = {
    "who developed you?": "I was developed by Shyam Kr. Sharma in India, on 02 January 2025",
    "who are you?": "I am a TechBot and, I am here to assist you.",
    "tum kaun ho?": "Main ek TechBot hoon aur, main aapki madad ke liye hun.",
};

// Start Command
bot.start((ctx) => ctx.reply("How can I help you?"));
bot.help((ctx) => ctx.reply("Please Contact my owner @Shyam_k_s"));

// Handle Messages
bot.on("text", async (ctx) => {
    const generatingMessage = await ctx.reply("Generating...");
    let question = ctx.message.text.trim().toLowerCase();

    if (predefinedAnswers[question]) {
        await ctx.reply(predefinedAnswers[question]);
    } else {
        try {
            const res = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
                { contents: [{ parts: [{ text: question }] }] }
            );

            const responseText = res.data?.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't generate a response.";
            await ctx.reply(responseText);
        } catch (err) {
            console.error("API Error:", err.message);
            await ctx.reply("Facing some difficulties, try again later.");
        }
    }

    await ctx.deleteMessage(generatingMessage.message_id);
});

// Handle Stickers
bot.on("sticker", (ctx) => ctx.reply("👍"));

// Handle Unrecognized Messages
bot.on("message", (ctx) => {
    if (!ctx.message.text) {
        ctx.reply("Sorry, I only support text messages.");
    }
});

// ✅ **Set Webhook for Serverless Deployment**
if (process.env.VERCEL_URL) {
    bot.telegram.setWebhook(`${process.env.VERCEL_URL}/api/webhook`)
        .then(() => console.log("Webhook set successfully!"))
        .catch((e) => console.log("Webhook set failed", e));
}

module.exports = bot;
