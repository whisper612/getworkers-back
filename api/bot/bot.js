const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const axios = require('axios')

module.exports = function(bot, telegrafObject) {
	// bot.use(telegrafObject.log())

    bot.start((ctx) => {
		console.log('New user has been spotted!')
		if(ctx.chat.type === 'private') {
			return ctx.reply('Здравствуйте! Для регистрации нажмите на кнопку 🗄️', Markup
			.keyboard([ ['🗄️ Регистрация'] ]).oneTime().resize().extra())
		}
    });
	
	bot.hears('🗄️ Регистрация', (ctx) => {
		return ctx.reply('Для  продолжения регистрации, пожалуйста, нажмите кнопку отправки номера телефона ☎️',
			Extra.markup((markup) => {
				return markup.resize().keyboard([ markup.contactRequestButton('☎️ Отправить номер телефона'), ]).oneTime()
			})
		)
	})

	bot.on('contact', (ctx) => {
	if (ctx.update.message.contact !== undefined) {
		axios.post('https://getworkers-back.herokuapp.com/add_executorj0NZhNh4D4GWbhXzBp40', {
			executor_id: ctx.update.message.contact.user_id,
			name: ctx.update.message.contact.first_name,
			phone: ctx.update.message.contact.phone_number
		  })
		  .then(res => {
			console.log(res.data);
			ctx.reply("Вы успешно зарегестрированы!")
		  })
		  .catch(err => {
			console.log(error);
			return ctx.reply('Что-то пошло не так и я не получил ваш номер телефона. Попробуйте ещё раз.', Markup
			.keyboard([ ['🗄️ Регистрация'] ]).oneTime().resize().extra())
		  })
		  
	}  else {
			return ctx.reply('Что-то пошло не так и я не получил ваш номер телефона. Попробуйте ещё раз.', Markup
			.keyboard([ ['🗄️ Регистрация'] ]).oneTime().resize().extra())
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
