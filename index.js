import express from 'express'
const app = express();
const port = process.env.PORT || 8080;
import dotenv from 'dotenv'
dotenv.config();
import { Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'
import { GoogleGenerativeAI } from "@google/generative-ai";
const canvas = require('canvas');
const fs = require('fs');
const { createCanvas } = require('canvas');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const bot = new Telegraf(process.env.BOT_API);



function generateImage(text) {
    const width = 800;
    const height = 300;

    // Create a canvas
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Background color
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Text settings
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 50px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Draw text on canvas
    ctx.fillText(text, width / 2, height / 2);

    // Convert to Buffer
    return canvas.toBuffer(); // Returns image as a buffer
}








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
    if(caseCheck === 'hi' || caseCheck === 'hello' || caseCheck === 'Hi' || caseCheck === 'Hello' || caseCheck === 'Hii'){
        const imageBuffer = generateImage('Hello Shyam How are you? ');
        await ctx.replyWithPhoto({ source: imageBuffer });
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