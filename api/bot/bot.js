const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')

module.exports = function(app, pool, bot, telegrafObject) {
	// bot.use(telegrafObject.log())
   
    bot.start((ctx) => {
		console.log('New user has been spotted!')
		if(ctx.chat.type === 'private') {
			return ctx.reply('Здравствуйте! Для регистрации нажмите на кнопку 🗄️', Markup
			.keyboard([
			['🗄️ Регистрация']
			]).oneTime().resize().extra()
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

	bot.on('contact', (ctx, app, pool) => {
	if (ctx.update.message.contact !== undefined) {
		const executorId = ctx.update.message.contact.user_id;
		const name = ctx.update.message.contact.first_name;
		const phone = ctx.update.message.contact.phone_number;
	
		const query = 
		`INSERT INTO executors_list (executor_id, name, phone)
		VALUES (?, ?, ?);`;
		
		pool.query(
			query, [executorId, name, phone], 
			(err, result, fields) => {
				if (err) {
					return ctx.reply('Что-то пошло не так и я не получил ваш номер телефона. Попробуйте ещё раз.', Markup
					.keyboard([
					['🗄️ Регистрация']
					])
					.oneTime()
					.resize()
					.extra()
				)
				} else {
					return ctx.reply('Вы были успешно зарегестрированы. Добро пожаловать!')
				}
			}
		);
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
	
	// bot.hears('📋 Указать имя', (ctx) => {
	// 	ctx.reply("Ну, пиши имя братан",
	// 		console.log(ctx.update.message.text),
	// 		bot.on('tmp',
	// 			ctx.reply("Ты пидор 0)000))0)))0")
	// 		)
	// 	)
	// })

    bot.launch()
}
