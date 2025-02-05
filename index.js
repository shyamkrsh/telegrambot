import express from 'express'
import { Telegraf } from "telegraf";
import { message } from 'telegraf/filters'
import dotenv from 'dotenv'
import axios from "axios";
dotenv.config();
const PORT = process.env.PORT || 8080;
const app = express();
app.use(express.json());

const bot = new Telegraf(process.env.BOT_API);

bot.start((ctx) => ctx.reply("You're Welcome here, How can i help you?"));
bot.help((ctx) => ctx.reply("Please Contact with my owner @Shyam_k_s"));
bot.on(message('text'), async (ctx) => {
    let question = ctx.update.message.text;
    if (question == 'who developed you?' || question == 'who developed you' || question == 'who have developed you' || question == 'who have developed you?' || question == 'who have developed you'
        || question == 'tumko kisne develop kiya?' || question == 'tumko kisne develop kiya' || question == 'aapko kisne develop kiya?' || question == 'tumko kisne banaya ?'
        || question == 'aapko kisne banaya ?' || question == 'where you have developed ?' || question == 'tumko is desh ne banaya hai ?' ||
        question == 'tumko is desh ne banaya hai ?' || question == 'tumko kisne banaya?' || question == 'where you have developed?' ||
        question == 'tumhara name kya hai?'
    ) {
        await ctx.reply("I wans developed by Shyam Kr. Sharma in India, on 02 January 2025");
    }
    else if(question == 'who are you?' || question == 'tum kaun ho ?' || question == 'tum kaun ho' || question == 'aap kaun hai?' || question == 'aap kaun hai'){
        await ctx.reply("I am a TechBot and, i am here to assist you.");
    } 
    else {
        await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyBfjro3dw9hviS_4YllqafkuwPEKT-P5UM`, {
            "contents": [{
                "parts": [{ "text": `${question}` }]
            }]
        }).then(async (res) => {
            await ctx.reply(res.data.candidates[0].content.parts[0].text);
        }).catch(async (err) => {
            await ctx.reply(`Facing some dificulties, try after sometime`);
        })
    }
})
bot.on(message('sticker'), (ctx) => ctx.reply('👍'));
bot.on('message', async(ctx) => {
    if(message.document || message.photo || message.video || message.audio || message.voice || message.video_note || message.sticker || message.contact || message.location || message.venue || message.poll || message.dice || message.game || message.animation){
        ctx.reply("Sorry, File input is not allowed. Please send text messages only.");
    }
})


bot.launch();
app.listen(PORT, () => {
    console.log(`app is listening to the port : ${PORT}`);
})

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))