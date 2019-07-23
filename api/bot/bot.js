const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const axios = require('axios')

module.exports = function(bot, telegramApi, telegrafObject, tokenObject) {
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
				return ctx.reply(`<b>Вы успешно зарегестрированы!</b>\n\n<i>Нажмите на ссылку чтобы присоединиться к группе рабочих, где Вы сможете брать заказы.</i>\n\n${tokenObject.chatLink}`, {parse_mode: 'HTML'})
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
		var execNumber = 0
		const executorId = ctx.update.callback_query.from.id;
		var orderId = ctx.update.callback_query.message.text.match(/\d{6}/)[0];
		const execNeed = parseInt(ctx.update.callback_query.message.text.match(/нужно:\s\d{1,3}/).toString().match(/\d{1,3}/).toString());

		// Availability order check 
		axios.post(`https://getworkers-back.herokuapp.com/select_executor${tokenObject.selectExecReq}`, {
			executor_id: executorId
		})
		.then(res => {
			const rcvOrderId = JSON.parse(res.data.check).order_id
				if (rcvOrderId !== '') {
					return ctx.answerCbQuery(`Вы уже взяли заказ под номером ${rcvOrderId}`)
				} else {	// Сustomer name and phone recieve
					var MSG = '';

					// Select number of current executor from DB
					axios.post(`https://getworkers-back.herokuapp.com/select_exec_number${tokenObject.selectExecNum}`, {
						order_id: orderId
					})
					.then(res => {
						execNumber = JSON.parse(res.data.check).executors_number;

						axios.post(`https://getworkers-back.herokuapp.com/select_order${tokenObject.selectOrderReq}`, {
						order_id: orderId
					})
					.then(res => {
						const name = JSON.parse(res.data.check).name;
						let phone = JSON.parse(res.data.check).phone;
						if (phone[0] == '7') {
							phone = '+' + phone;
						}

						MSG = `👨 Имя заказчика: ${name}\n\n📱 Номер заказчика: ${phone}\n\n${ctx.update.callback_query.message.text}`;
						execNumber++;
					})

						// Check the number of the worker who took the order
					if (execNeed === 1) {
						execNumber++;
						axios.post(`https://getworkers-back.herokuapp.com/update_executor${tokenObject.updateExecReq}`, {
						order_id: orderId,	
						executor_id: executorId
						})
						.then(res => {
							const reply = `<b>Вы откликнулись на заказ!</b>\n\nТеперь вам нужно: <i>связаться с заказчиком и быть вовремя.</i>\n\n${MSG}`;

							axios.post(`https://getworkers-back.herokuapp.com/update_exec_number${tokenObject.updateExecNum}`, {
							order_id: orderId,
							executors_number: execNumber
							})

							return telegramApi.sendMessage(executorId, reply, {parse_mode: `HTML`})
						})
					} else if (execNumber === 0 && execNeed !== 1) {
						execNumber++;
						axios.post(`https://getworkers-back.herokuapp.com/update_exec_number${tokenObject.updateExecNum}`, {
							order_id: orderId,
							executors_number: execNumber
						})
						.then(res => {
							orderId += '*'
							axios.post(`https://getworkers-back.herokuapp.com/update_executor${tokenObject.updateExecReq}`, {
							order_id: orderId,	
							executor_id: executorId
							})
							.then(res => {
								const reply = `<b>Вы первым откликнулись на заказ!</b>\n\nТеперь вам нужно:\n
								👷 <b>1)</b> Дождаться <i>оставшихся работников</i>, они с вами свяжутся.
								📞 <b>2)</b> Связаться с <i>заказчиком</i> и уточнить детали встречи. 
								🚚 <b>3)</b> Cобраться вместе и отправиться к <i>заказчику</i>.\n
								<b>Детали заказа:</b>\n${MSG}`;
	
								return telegramApi.sendMessage(executorId, reply, {parse_mode: `HTML`})
							});
						});

					} else if (execNumber > 0){
						execNumber++;
						axios.post(`https://getworkers-back.herokuapp.com/update_exec_number${tokenObject.updateExecNum}`, {
							order_id: orderId,
							executors_number: execNumber
						})

						var reply = ''
						axios.post(`https://getworkers-back.herokuapp.com/update_executor${tokenObject.updateExecReq}`, {
						order_id: orderId,	
						executor_id: executorId
						})
						.then(res => {
							axios.post(`https://getworkers-back.herokuapp.com/select_first_exec${tokenObject.selectFirstExec}`, {
								order_id: orderId
							})
							.then(res => {
								const name = JSON.parse(res.data.check).name;
								const phone = JSON.parse(res.data.check).phone;
								reply = `<b>Другой рабочий</b> принял заказ <b>первым</b>,\nвам нужно с ним <b>связаться</b> чтобы отправиться к заказчику <b>вместе</b>.\n\n<b>Контакнтые данные:</b>
								👷 <b>Имя:</b> ${name}
								📞 <b>Телефон:</b> ${phone}`;

								return telegramApi.sendMessage(executorId, reply, {parse_mode: `HTML`})
							})
						})
					}

					// Push notification
					ctx.answerCbQuery(`Заказ принял(и) ${execNumber} из ${execNeed} рабочий(их) 👷`)
					if (execNumber === execNeed) {
						let d = new Date().toLocaleDateString().replace('.', '-').replace('.', '-')
						let today = `${d.slice(6)}-${d.slice(3,5)}-${d.slice(0,2)}`;
						const updateTime = `${today} ${new Date().toLocaleTimeString()}`;						
												
						axios.post(`https://getworkers-back.herokuapp.com/update_order_status${tokenObject.updOrderStat}`, {
							order_id: orderId,
							status: 'В работе',
							update_time: updateTime
						})
						.catch((res) => {
							console.log('Error when edit status from bot', res)
						})

						const extra = {
							reply_markup: JSON.stringify({
								inline_keyboard: [
									[{text: '', callback_data: ''}]
								]
							})
						}
						telegramApi.editMessageReplyMarkup(ctx.chat.id, ctx.update.callback_query.message.message_id, extra)
					}
				})
			}
		})
		.catch((res) => {
			return ctx.answerCbQuery(`Вас исключили, обратитесь к администратору.`)
		})		
	})

	bot.launch()
}