const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')

module.exports = function(app, bot, telegramObject, telegrafObject, pool) {
	// bot.use(telegrafObject.log())
   
    bot.start((ctx) => {
		console.log('New user has been spotted!')
		if(ctx.chat.type === 'private') {
			return ctx.reply('Здравствуйте! Для регистрации нажмите на кнопку 🗄️', Markup
			.keyboard([
			['🗄️ Регистрация']
			])
			.oneTime()
			.resize()
			.extra()
			)
		}
		
    });
	
	bot.hears('🗄️ Регистрация', (ctx) => {
		return ctx.reply('Для  продолжения регистрации, пожалуйста, нажмите кнопку отправки номера телефона ☎️',
			Extra.markup((markup) => {
				return markup.resize()
				.keyboard([
					markup.contactRequestButton('☎️ Отправить номер телефона'),
				]).oneTime()
			})
		)
	})

	bot.on('contact', (ctx, pool) => {
	if (ctx.update.message.contact !== undefined) {
		ctx.reply('Успешно! Для завершения регистрации, пожалуйста, укажите своё имя.',
			console.log(ctx.update.message.text),
			bot.hears('local', (ctx) => {
				ctx.reply('Регистрация успешно завершена, если вы ошибилсь при написании имени, то сообщите об этом администратору.')
			})
		)
	}  else {
			return ctx.reply('Что-то пошло не так и я не получил ваш номер телефона. Попробуйте ещё раз.', Markup
				.keyboard([
				['🗄️ Регистрация']
				])
				.oneTime()
				.resize()
				.extra()
			)
		}
	})
    
    bot.launch()
}
