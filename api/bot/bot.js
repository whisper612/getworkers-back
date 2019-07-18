const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const axios = require('axios')

module.exports = function(bot, telegramApi, tokenObject) {
	// bot.use(telegrafObject.log())
	// console.log(telegramApi)
	// спасити(

    bot.start((ctx) => {
		if(ctx.update.message.chat.type === 'private') {
			console.log('New worker has been spotted!')
			return ctx.reply('Здравствуйте! Для регистрации нажмите на кнопку 🗄️', Markup
			.keyboard([ ['🗄️ Регистрация'] ]).oneTime().resize().extra())
		}
		if(ctx.update.message.chat.type === 'group') {
			console.log('New developer has been spotted!')
			return ctx.reply('Logs has been sent to the server console',
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
		axios.post(`https://getworkers-back.herokuapp.com/add_executor${tokenObject.addExecReq}`, {
			executor_id: ctx.update.message.contact.user_id,
			name: ctx.update.message.contact.first_name,
			phone: ctx.update.message.contact.phone_number
		  })
		  .then(res => {
			  if(res.data.check === ctx.update.message.contact.user_id) {
				console.log(res.data);
				return ctx.reply(`<b>Вы успешно зарегестрированы!</b> \n<i>Нажмите на ссылку чтобы присоединиться к груупе рабочих, где Вы сможете брать заказы.</i>\n\n${tokenObject.chatLink}`, {parse_mode: 'HTML'})
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

	bot.action('🛠️', (ctx) => {
		//console.log('!!!Update context only!!!', ctx.update)

		const orderId = ctx.update.callback_query.message.text.match(/\d{6}/)[0];
		const executorId = ctx.update.callback_query.from.id;

		axios.post(`https://getworkers-back.herokuapp.com/select_executor${tokenObject.selectExecReq}`, {
			executor_id: executorId
		})
		.then(res => {
			console.log(res)
			if (res.data.check.orderId !== null) {
				return telegramApi.sendMessage(executorId, `Вы уже взяли заказ под номером ${res.data.check.orderId}`)
			} else {
				axios.post(`https://getworkers-back.herokuapp.com/update_executor${tokenObject.updateExecReq}`, {
					order_id: orderId,	
					executor_id: executorId
				})
				.then(res => {
					if(true) {
						// console.log(`Update Executor ${res.data}`);
						return telegramApi.sendMessage(executorId, `Ты пидор`)
					}
				})
			}
		})		
	})

	bot.launch()
}
