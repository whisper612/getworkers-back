// const Extra = require('telegraf/extra')
// const Markup = require('telegraf/markup')
// const axios = require('axios')

// module.exports = function(bot, telegramApi, tokenObject) {
// 	// bot.use(telegrafObject.log())
// 	// console.log(telegramApi)
// 	// спасити(

//     bot.start((ctx) => {
// 		if(ctx.update.message.chat.type === 'private') {
// 			console.log('New worker has been spotted!')
// 			return ctx.reply('Здравствуйте! Для регистрации нажмите на кнопку 🗄️', Markup
// 			.keyboard([ ['🗄️ Регистрация'] ]).oneTime().resize().extra())
// 		}
// 		if(ctx.update.message.chat.type === 'group') {
// 			console.log('New developer has been spotted!')
// 			return ctx.reply('Logs has been sent to the server console',
// 			// console.log(ctx.update.message.entities) [ { offset: 0, length: 6, type: 'bot_command' } ]
// 			console.log('!!!All context!!!', ctx),
// 			console.log('!!!Update context only!!!', ctx.update)
// 			)	
// 		}
//     });

// 	bot.hears('🗄️ Регистрация', (ctx) => {
// 		return ctx.reply('Для  продолжения регистрации, пожалуйста, нажмите кнопку отправки номера телефона ☎️',
// 			Extra.markup((markup) => {
// 				return markup.resize().keyboard([ markup.contactRequestButton('☎️ Отправить номер телефона'), ]).oneTime()
// 			})
// 		)
// 	})

// 	bot.on('contact', (ctx) => {
// 	if (ctx.update.message.contact !== undefined) {
// 		axios.post(`https://getworkers-back.herokuapp.com/add_executor${tokenObject.addExecReq}`, {
// 			executor_id: ctx.update.message.contact.user_id,
// 			name: ctx.update.message.contact.first_name,
// 			phone: ctx.update.message.contact.phone_number
// 		  })
// 		  .then(res => {
// 			  if(res.data.check === ctx.update.message.contact.user_id) {
// 				console.log(res.data);
// 				return ctx.reply(`<b>Вы успешно зарегестрированы!</b> \n<i>Нажмите на ссылку чтобы присоединиться к груупе рабочих, где Вы сможете брать заказы.</i>\n\n${tokenObject.chatLink}`, {parse_mode: 'HTML'})
// 			  } else if (res.data.code === 'ER_DUP_ENTRY') {
// 				console.log(res.data.code);
// 				return ctx.reply('Вы уже зарегестрированны. Если вы хотите удалить свой профиль, то свяжитесь с администратором.')
// 			  } else {
// 				console.log(res.data);
// 				return ctx.reply('Что-то пошло не так и я не получил ваш номер телефона. Попробуйте ещё раз.', Markup
// 				.keyboard([ ['🗄️ Регистрация'] ]).oneTime().resize().extra())
// 			  }
// 		  })
// 	}  else {
// 			return ctx.reply('Что-то пошло не так и я не получил ваш номер телефона. Попробуйте ещё раз.', Markup
// 			.keyboard([ ['🗄️ Регистрация'] ]).oneTime().resize().extra())
// 		}
// 	})

// 	var MSG = '';
// 	bot.action('🛠️', (ctx) => {
// 		//console.log('!!!Update context only!!!', ctx.update)
// 		const orderId = ctx.update.callback_query.message.text.match(/\d{6}/)[0];
// 		const executorId = ctx.update.callback_query.from.id;

// 		axios.post(`https://getworkers-back.herokuapp.com/select_order${tokenObject.selectOrderReq}`, {
// 			order_id: orderId
// 		})
// 		.then(res => {
// 			const name = JSON.parse(res.data.check)[0].name;
// 			let phone = JSON.parse(res.data.check)[0].phone;
// 			if (phone[0] == '7')
// 				phone = '+' + phone
// 			const msg = `👨 Имя заказчика: ${name}\n\n📱 Номер заказчика: ${phone}\n\n${ctx.update.callback_query.message.text}`;
// 			MSG = msg
// 		})

// 		axios.post(`https://getworkers-back.herokuapp.com/select_executor${tokenObject.selectExecReq}`, {
// 			executor_id: executorId
// 		})
// 		.then(res => {
// 			const rcvOrderId = JSON.parse(res.data.check).order_id
// 			console.log(rcvOrderId)
// 			if (rcvOrderId !== '') {
// 				return telegramApi.sendMessage(executorId, `Вы уже взяли заказ под номером ${rcvOrderId}`)
// 			} else {
// 				axios.post(`https://getworkers-back.herokuapp.com/update_executor${tokenObject.updateExecReq}`, {
// 					order_id: orderId,	
// 					executor_id: executorId
// 				})
// 				.then(res => {
// 					if(true) {
// 						const reply = `<b>Вы первым откликнулись на заказ!</b>\n\nТеперь вам нужно:\n<b>1)</b> Дождаться <i>оставшихся работников</i>\n\n<b>2)</b> Cобраться вместе и отправиться к <i>заказчику</i>.\n\n${MSG}`
// 						const extra = {parse_mode: `HTML`}
// 						return telegramApi.sendMessage(executorId, reply, extra)
// 					}	
// 				})
// 			}
// 		})		
// 	})

// 	bot.launch()
// }

const Telegraf = require('telegraf')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')

module.exports = function(bot, telegramApi, tokenObject) {
	bot.use(Telegraf.log())

	bot.command('onetime', ({ reply }) =>
	reply('One time keyboard', Markup
		.keyboard(['/simple', '/inline', '/pyramid'])
		.oneTime()
		.resize()
		.extra()
	)
	)

	bot.command('custom', ({ reply }) => {
	return reply('Custom buttons keyboard', Markup
		.keyboard([
		['🔍 Search', '😎 Popular'], // Row1 with 2 buttons
		['☸ Setting', '📞 Feedback'], // Row2 with 2 buttons
		['📢 Ads', '⭐️ Rate us', '👥 Share'] // Row3 with 3 buttons
		])
		.oneTime()
		.resize()
		.extra()
	)
	})

	bot.hears('🔍 Search', ctx => ctx.reply('Yay!'))
	bot.hears('📢 Ads', ctx => ctx.reply('Free hugs. Call now!'))

	bot.command('special', (ctx) => {
	return ctx.reply('Special buttons keyboard', Extra.markup((markup) => {
		return markup.resize()
		.keyboard([
			markup.contactRequestButton('Send contact'),
			markup.locationRequestButton('Send location')
		])
	}))
	})

	bot.command('pyramid', (ctx) => {
	return ctx.reply('Keyboard wrap', Extra.markup(
		Markup.keyboard(['one', 'two', 'three', 'four', 'five', 'six'], {
		wrap: (btn, index, currentRow) => currentRow.length >= (index + 1) / 2
		})
	))
	})

	bot.command('simple', (ctx) => {
	return ctx.replyWithHTML('<b>Coke</b> or <i>Pepsi?</i>', Extra.markup(
		Markup.keyboard(['Coke', 'Pepsi'])
	))
	})

	bot.command('inline', (ctx) => {
	return ctx.reply('<b>Coke</b> or <i>Pepsi?</i>', Extra.HTML().markup((m) =>
		m.inlineKeyboard([
		m.callbackButton('Coke', 'Coke'),
		m.callbackButton('Pepsi', 'Pepsi')
		])))
	})

	bot.command('random', (ctx) => {
	return ctx.reply('random example',
		Markup.inlineKeyboard([
		Markup.callbackButton('Coke', 'Coke'),
		Markup.callbackButton('Dr Pepper', 'Dr Pepper', Math.random() > 0.5),
		Markup.callbackButton('Pepsi', 'Pepsi')
		]).extra()
	)
	})

	bot.command('caption', (ctx) => {
	return ctx.replyWithPhoto({ url: 'https://picsum.photos/200/300/?random' },
		Extra.load({ caption: 'Caption' })
		.markdown()
		.markup((m) =>
			m.inlineKeyboard([
			m.callbackButton('Plain', 'plain'),
			m.callbackButton('Italic', 'italic')
			])
		)
	)
	})

	bot.hears(/\/wrap (\d+)/, (ctx) => {
	return ctx.reply('Keyboard wrap', Extra.markup(
		Markup.keyboard(['one', 'two', 'three', 'four', 'five', 'six'], {
		columns: parseInt(ctx.match[1])
		})
	))
	})

	bot.action('Dr Pepper', (ctx, next) => {
	return ctx.reply('👍').then(() => next())
	})

	bot.action('plain', async (ctx) => {
	ctx.editMessageCaption('Caption', Markup.inlineKeyboard([
		Markup.callbackButton('Plain', 'plain'),
		Markup.callbackButton('Italic', 'italic')
	]))
	})

	bot.action('italic', (ctx) => {
	ctx.editMessageCaption('_Caption_', Extra.markdown().markup(Markup.inlineKeyboard([
		Markup.callbackButton('Plain', 'plain'),
		Markup.callbackButton('* Italic *', 'italic')
	])))
	})

	bot.action(/.+/, (ctx) => {
	return ctx.answerCbQuery(`Oh, ${ctx.match[0]}! Great choice`)
	})

	bot.launch()	
}