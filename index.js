import express from 'express'
const app = express();
const port = process.env.PORT || 8080;
import dotenv from 'dotenv'
dotenv.config();
import { Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'
import { GoogleGenerativeAI } from "@google/generative-ai";


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const bot = new Telegraf(process.env.BOT_API);

bot.start((ctx) => ctx.reply("How can i help you ?"));
bot.help((ctx) => ctx.reply("Please Contact with my owner @Shyam_k_s"));
bot.on(message('text'), async (ctx) => {
    const generatingMessage = await ctx.reply("Generating...");
    let question = ctx.update.message.text;
    let caseCheck = question.toLowerCase();

    if (caseCheck === 'resume') {
        await ctx.replyWithDocument(
            { source: './file/resume.pdf' },
            { caption: "<strong>Shyam Kumar Sharma</strong>\n\n Here is Shyam's Resume.", parse_mode: 'HTML' }
        );
        await ctx.deleteMessage(generatingMessage.message_id);
        return;
    }

    try {
        const result = await model.generateContent({
            contents: [
                {
                    role: "user",
                    parts: [{ text: question }]
                }
            ],
            systemInstruction: "you are a AI assistant to answers all the questions, but if user ask about your development then don't reply or say i don't know"
        });

        await ctx.reply(result.response.text());
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