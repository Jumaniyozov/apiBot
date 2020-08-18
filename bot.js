const Telegraf = require('telegraf')
// const express = require('express')

const bot = new Telegraf('1343858667:AAErXGB0fIkwn2EpEHQMDbJkLPmIXy3_O08')

const axios = require('axios');
const fs = require('fs');

const helpMessage = `
*Simple Api Bot*
/fortune - get a fortune cookie
/cat - get a random cat pic
/cat \`<text>\` - get cat image with text
/dogbreeds - get a list of dog breeds
/dog \`<bread>\` - get a random picture of dog breed
`;

bot.help(ctx => {
    // ctx.reply(helpMessage);
    bot.telegram.sendMessage(
        ctx.chat.id,
        helpMessage,
        {parse_mode: 'markdown'}
    )
})

bot.command('fortune', async (ctx) => {
    const data = await axios.get('http://yerkee.com/api/fortune');
    bot.telegram.sendChatAction(ctx.chat.id, 'typing')
    ctx.reply(data.data.fortune)
})


bot.command('cat', async (ctx) => {
    let input = ctx.message.text;
    let inputArr = input.split(' ');

    if (inputArr.length === 1) {
        ctx.replyWithPhoto(`https://cataas.com/cat/`);
    } else {
        inputArr.shift();
        input = inputArr.join(' ');
        ctx.replyWithPhoto(`https://cataas.com/cat/says/${input}`);
    }
})


bot.command('dogbreeds', ctx => {
    let rawData = fs.readFileSync("./dogbreeds.json", "utf8");
    let data = JSON.parse(rawData);
    let message = "Dog breeds: \n";
    data.forEach(item => {
        message += `-${item}\n`;
    })

    ctx.reply(message);
})

bot.command('dog', ctx => {
    let input = ctx.message.text.split(' ');
    if (input.length !== 2) {
        ctx.reply("You must give a dog breed as the second argument")
    }
    let breedInput = input[1];
    let rawdata = fs.readFileSync('./dogbreeds.json', 'utf8');
    let data = JSON.parse(rawdata);
    if (data.includes(breedInput)) {
        axios.get(`https://dog.ceo/api/breed/${breedInput}/images/random`)
            .then(res => ctx.replyWithPhoto(res.data.message))
            .catch(err => console.error(err));
    } else {
        let suggestion = data.filter(item => {
            return item.startsWith(breedInput);
        })

        let message = `Did you mean: \n`;
        suggestion.forEach(item => {
            message += `-${item}\n`;
        })

        if (suggestion.length === 0) {
            ctx.reply('Cannot find breed')
        } else {
            ctx.reply(message);
        }
    }
})


bot.launch();