import express from 'express';
import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const PORT = process.env.PORT || 3000; // Vercel typically uses port 3000
const app = express();
app.use(express.json());

const bot = new Telegraf(process.env.BOT_API);

bot.start((ctx) => ctx.reply("You're Welcome here, How can I help you?"));
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

    const answer = predefinedAnswers[question.toLowerCase()]; // Case-insensitive lookup

    if (answer) {
        await ctx.reply(answer);
        await ctx.deleteMessage(generatingMessage.message_id); // Delete "Generating..." message
        return; // Stop further processing
    }


    try {
        const res = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, { // Use environment variable for API key
            "contents": [{
                "parts": [{ "text": `${question}` }]
            }]
        });

        await ctx.reply(res.data.candidates[0].content.parts[0].text);
        await ctx.deleteMessage(generatingMessage.message_id);
    } catch (err) {
        console.error("Error calling Gemini API:", err); // Log the error for debugging
        await ctx.reply(`Facing some difficulties, try after some time.  Error: ${err.message}`); // Include error message for user in some cases
        await ctx.deleteMessage(generatingMessage.message_id); // Delete "Generating..." message even on error
    }
});


bot.on(message('sticker'), (ctx) => ctx.reply('👍'));

bot.on('message', async (ctx) => {
    const allowedMessageTypes = ['text']; // Only allow text messages
    if (!allowedMessageTypes.includes(ctx.message.type)) {
        ctx.reply("Sorry, File input is not allowed. Please send text messages only.");
    }
});

// Vercel-specific configuration
app.get('/', (req, res) => res.send('Bot is running!')); // Important for Vercel health checks
app.use(bot.webhookCallback('/telegraf')); // Set the webhook path

// Start the server
app.listen(PORT, () => {
    console.log(`App is listening to the port : ${PORT}`);
});


// Set webhook (only if not already set) -  Important for Vercel deployment
if (process.env.VERCEL_URL) { // Check if running on Vercel
    bot.telegram.setWebhook(`${process.env.VERCEL_URL}/telegraf`).then(() => console.log("Webhook set successfully!")).catch(e => console.log("Webhook set failed", e));
}

// Graceful shutdown (important for Vercel)
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));