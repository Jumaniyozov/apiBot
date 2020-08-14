
const Telegraf = require('telegraf')
const express = require('express')

const bot = new Telegraf('1343858667:AAErXGB0fIkwn2EpEHQMDbJkLPmIXy3_O08')
// Set the bot response
bot.start((ctx)  => ctx.reply('Whatup?'))
bot.command('/saysome', (ctx) => {
    // Explicit usage
    ctx.reply('Watchuu say?');
})
// bot.on('text', ({ replyWithHTML }) => replyWithHTML('<b>Hello</b>'))
// Set telegram webhook
// get ngrok & ngrok.exe http 80
bot.telegram.setWebhook('https://63e9ea4ff0c2.ngrok.io/secret-path')

const app = express()
app.get('/', (req, res) => res.send('Hello fff!'))
// Set the bot API endpoint
app.use(bot.webhookCallback('/secret-path'))
app.listen(80, () => {
    console.log('Example app listening on port 80!')
})