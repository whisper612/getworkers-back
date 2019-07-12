const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const axios = require('axios')

module.exports = function(bot, telegramApi) {
	// bot.use(telegrafObject.log())
	// console.log(telegramApi)

    bot.start((ctx) => {
		if(ctx.update.message.chat.type === 'private') {
			console.log('New worker has been spotted!')
			return ctx.reply('Здравствуйте! Для регистрации нажмите на кнопку 🗄️', Markup
			.keyboard([ ['🗄️ Регистрация'] ]).oneTime().resize().extra())
		}
		if(ctx.update.message.chat.type === 'group' && ctx.update.message.from.id === 294217967) {
			console.log('New developer has been spotted!')
			return ctx.reply('Дорогой разраб, твои логи отправлены в серверную консоль',
			// console.log(ctx.update.message.entities) [ { offset: 0, length: 6, type: 'bot_command' } ]
			console.log('!!!All context!!!', ctx),
			console.log('!!!Update context only!!!', ctx.update)
			)	
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
			  if(res.data.check === ctx.update.message.contact.user_id) {
				console.log(res.data);
				/* АВТОМАТИЧЕСКИЙ ПЕРЕБРОС В КОНФУ in developing */
				return ctx.reply("Вы успешно зарегестрированы!")
			  } else if (res.data.code === 'ER_DUP_ENTRY') {
				console.log(res.data.code);
				return ctx.reply('Вы уже зарегестрированны. Если вы хотите удалить свой профиль, то свяжитесь с администратором.')
			  } else {
				console.log(res.data);
				return ctx.reply('Что-то пошло не так и я не получил ваш номер телефона. Попробуйте ещё раз.', Markup
				.keyboard([ ['🗄️ Регистрация'] ]).oneTime().resize().extra())
			  }
		  })
	}  else {
			return ctx.reply('Что-то пошло не так и я не получил ваш номер телефона. Попробуйте ещё раз.', Markup
			.keyboard([ ['🗄️ Регистрация'] ]).oneTime().resize().extra())
		}
	})

	bot.hears('🛠️ Взяться за работу', (ctx) => {

	})

	bot.launch()
}
