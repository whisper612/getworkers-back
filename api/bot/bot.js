
module.exports = function(app, bot, telegramObject, pool) {

    bot.start((ctx) => {
        console.log('New user has been spotted!')
        if (ctx.chat.type === 'private') {
            ctx.reply(`Привет, для регистрации нажми на кнопку "Зарегестрироваться"! 
            ID нашего чата:${ctx.chat.id} Тип нашего чата:${ctx.chat.type}`)
            bot.hears('/register', (ctx) => 
                telegramObject.getChatMember(ctx.chat.id, ctx),
                ctx.reply(`Твой ID, братан: ${ctx.user}
                Твой контекст, братан: ${ctx}`)
            );
        } else if (ctx.chat.type === 'group') {
            ctx.reply(`Привет, для регистрации нажми на кнопку "Зарегестрироваться"! 
            ID нашего чата:${ctx.chat.id} Тип нашего чата:${ctx.chat.type}`)
            bot.command('/register', (ctx) => 
                ctx.reply(`Твой ID, братан: ${ctx.user}`)
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
