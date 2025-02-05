import express from 'express'
const app = express();
const port = process.env.PORT || 8080;
import axios from 'axios';
import dotenv from 'dotenv'
dotenv.config();
import { Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'

const bot = new Telegraf(process.env.BOT_API);

bot.start((ctx) => ctx.reply("How can i help you ?"));
bot.help((ctx) => ctx.reply("Please Contact with my owner @Shyam_k_s"));
bot.on(message('text'), async (ctx) => {
    const generatingMessage = await ctx.reply("Generating...");
    let question = ctx.update.message.text;
    const predefinedAnswers = {
        "who developed you?": "I was developed by Shyam Kr. Sharma in India, on 02 January 2025",
        "who developed you": "I was developed by Shyam Kr. Sharma in India, on 02 January 2025",
        "who have developed you?": "I was developed by Shyam Kr. Sharma in India, on 02 January 2025",
        "who have developed you": "I was developed by Shyam Kr. Sharma in India, on 02 January 2025",
        "who have developed you": "I was developed by Shyam Kr. Sharma in India, on 02 January 2025",
        "tumko kisne develop kiya?": "Mujhe Shyam Kr. Sharma ne India mein, 02 January 2025 ko develop kiya hai.", // Hindi translation
        "tumko kisne develop kiya": "Mujhe Shyam Kr. Sharma ne India mein, 02 January 2025 ko develop kiya hai.",
        "aapko kisne develop kiya?": "Mujhe Shyam Kr. Sharma ne India mein, 02 January 2025 ko develop kiya hai.",
        "tumko kisne banaya ?": "Mujhe Shyam Kr. Sharma ne India mein, 02 January 2025 ko banaya hai.",
        "aapko kisne banaya ?": "Mujhe Shyam Kr. Sharma ne India mein, 02 January 2025 ko banaya hai.",
        "where you have developed ?": "I was developed in India.",
        "tumko is desh ne banaya hai ?": "Mujhe India mein develop kiya gaya hai.",
        "tumko kisne banaya?": "Mujhe Shyam Kr. Sharma ne banaya hai.",
        "where you have developed?": "I was developed in India.",
        "tumhara name kya hai?": "Main ek TechBot hoon.", // Hindi translation
        "who are you?": "I am a TechBot and, I am here to assist you.",
        "tum kaun ho ?": "Main ek TechBot hoon aur, main aapki madad ke liye hun.",
        "tum kaun ho": "Main ek TechBot hoon aur, main aapki madad ke liye hun.",
        "aap kaun hai?": "Main ek TechBot hoon aur, main aapki madad ke liye hun.",
        "aap kaun hai": "Main ek TechBot hoon aur, main aapki madad ke liye hun.",
    };

    const answer = predefinedAnswers[question.toLowerCase()];

    if (answer) {
        await ctx.reply(answer);
        await ctx.deleteMessage(generatingMessage.message_id);
        return;
    }

    try {

        const res = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
            "contents": [{
                "parts": [{ "text": `${question}` }]
            }]
        });

        await ctx.reply(res.data.candidates[0].content.parts[0].text);
        await ctx.deleteMessage(generatingMessage.message_id);
    } catch (err) {
        await ctx.reply(`Facing some difficulties, try after some time.`);
        await ctx.deleteMessage(generatingMessage.message_id);
    }
});

bot.on(message('sticker'), (ctx) => ctx.reply('👍'));
bot.on('message', async (ctx) => {
    const allowedMessageTypes = ['text'];
    if (!allowedMessageTypes.includes(ctx.message.type)) {
        ctx.reply("Sorry, File input is not allowed. Please send text messages only.");
    }
});

bot.launch();
app.listen(port, () => {
    console.log(`server is listening to the port : ${port}`);
})
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));