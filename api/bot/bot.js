module.exports = function(app, bot, pool) {
    bot.start((ctx) => {
        console.log('Bot has been deployed together with a server')
    });
    bot.command('register', (ctx) => ctx.reply('Try send a sticker'));
    
    bot.hears('hi', (ctx) => ctx.reply('Hello, stranger!'));
    bot.hears(/bye/i, (ctx) => ctx.reply('Bye-bye, stranger!'));
    bot.on('sticker', (ctx) => ctx.reply('👍'))
    
    bot.launch()
}
