module.exports = function(app, bot, pool) {

    bot.start((ctx) => {
        console.log('New user has been spotted!')
        if (ctx.chat.type === 'private') {
            ctx.reply('Привет, для регистрации нажми на кнопку "Зарегестрироваться"!')
            bot.command('/register', (ctx) => 
                ctx.reply(`Твой ID, братан${ctx.user.id}`)
            );
        }
    });

    /*const userId = null;
    bot.command('register', (ctx) => 
        userId.telegram.getChatMember(ctx, ctx),
    );
    
    console.log(userId);*/


    // bot.hears('hi', (ctx) => ctx.reply('Hello, stranger!'));
    // bot.hears(/bye/i, (ctx) => ctx.reply('Bye-bye, stranger!'));
    // bot.on('sticker', (ctx) => ctx.reply('👍'))
    
    bot.launch()
}
