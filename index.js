require('dotenv').config();
const { Bot, GrammyError, HttpError, Keyboard, InlineKeyboard } = require('grammy');
const { hydrate } = require('@grammyjs/hydrate');


const bot = new Bot(process.env.BOT_API_KEY);
bot.use(hydrate());


bot.api.setMyCommands([
    { command: 'start', description: 'Start the bot' },
    { command: 'menu', description: 'give menu' },
])

bot.command('start', async (ctx) => {
    await ctx.reply('Hello, I am a simple bot!');
})
const menuKeyboard = new InlineKeyboard().text('Order status', 'order-status').text('Order support', 'order-support');
const backKeyboard = new InlineKeyboard().text('< Back', 'back')
bot.command('menu', async (ctx) => {
    await ctx.reply('Choose your option:', {
        reply_markup: menuKeyboard,
    });

});
bot.callbackQuery('order-status', async (ctx) => {
    await ctx.callbackQuery.message.editText('Order status', {
        reply_markup: backKeyboard,
    })
    await ctx.answerCallbackQuery();
});
bot.callbackQuery('order-support', async (ctx) => {
    await ctx.callbackQuery.message.editText('Order support', {
        reply_markup: backKeyboard,
    })
    await ctx.answerCallbackQuery();
});
bot.callbackQuery('back', async (ctx) => {
    await ctx.callbackQuery.message.editText('Choose your option:', {
        reply_markup: menuKeyboard,
    })
    await ctx.answerCallbackQuery();
});


bot.catch(async (err) => {
    err.ctx = ctx;
    console.error(`Error: ${ctx.update_id}: `);
    const e = err.error;

    if (e instanceof GrammyError) {
        console.error("Error in request", e.description);
    } else if (e instanceof HttpError) {
        console.error("Error in HTTP request", e.message);
    } else {
        console.error("Unknown error", e);
    }
});



bot.start();