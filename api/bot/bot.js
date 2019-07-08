module.exports = function(app, bot, pool) {
    bot.start((ctx) => {
        console.log('Bot has been deployed together with a server')
    });
    const userId = null;
    bot.command('register', (ctx) => 
        userId.telegram.getChatMember(ctx, ctx),
        ctx.reply(userId)
    );
    
    console.log(userId);


    // bot.hears('hi', (ctx) => ctx.reply('Hello, stranger!'));
    // bot.hears(/bye/i, (ctx) => ctx.reply('Bye-bye, stranger!'));
    // bot.on('sticker', (ctx) => ctx.reply('👍'))
    
    bot.launch()
}
