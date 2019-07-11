const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')

module.exports = function(app, bot, telegramObject, telegrafObject, pool) {

    bot.use(telegrafObject.log())
   
    bot.start((ctx) => {
        console.log('New user has been spotted!')
		return ctx.reply('Здравствуйте! Для регистрации нажмите на кнопку 🗄️', Markup
			.keyboard([
			['🗄️ Регистрация']
			])
			.oneTime()
			.resize()
			.extra()
		)
    });
	
	var phone = ''
	bot.hears('🗄️ Регистрация', (ctx) => {
		return ctx.reply('Для  продолжения регистрации, пожалуйста, нажмите кнопку отправки номера телефона ☎️', Extra.markup((markup) => {
			return markup.resize()
				.keyboard([
				markup.contactRequestButton('☎️ Отправить номер телефона'),
				phone = ctx.contact.phone_number
				])
				.oneTime()
		}))
	})

	bot.hear(phone, (ctx) => {
		console.log(phone)
	if (phone !== undefined) {
		ctx.reply('Успешно! Для завершения регистрации, пожалуйста, укажите своё имя.', (ctx) => {
			bot.hears(ctx.text, (ctx) => {
				console.log(ctx.text)
				ctx.reply('Регистрация успешно завершена, если вы ошибилсь при написании имени, то сообщите об этом администратору.')
			})
		})
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









	// } else if (ctx.chat.type === 'group') {
	// 	ctx.reply(`Привет, для регистрации нажми на кнопку "Зарегестрироваться"! ID нашего чата:${ctx.chat.id} Тип нашего чата:${ctx.chat.type}`)
	// 	bot.command('/register', (ctx) => 
	// 		console.log(`Твой ID, братан: ${ctx.user}`)
	// 	);
	// }




//     bot.hears('/register', (ctx) => 
//     telegramObject.getChatMember(ctx.chat.id, ctx),
//     console.log(`Твой ID, братан: ${ctx.user}
//     Твой контекст, братан: ${ctx}`),
//     ctx.reply(`Чекай логи сервера`)
// );

//     bot.command('onetime', ({ reply }) =>
//     reply('One time keyboard', Markup
//       .keyboard(['/simple', '/inline', '/pyramid'])
//       .oneTime()
//       .resize()
//       .extra()
//     )
//   )
  
//   bot.command('custom', ({ reply }) => {
//     return reply('Custom buttons keyboard', Markup
//       .keyboard([
//         ['🔍 Search', '😎 Popular'], // Row1 with 2 buttons
//         ['☸ Setting', '📞 Feedback'], // Row2 with 2 buttons
//         ['📢 Ads', '⭐️ Rate us', '👥 Share'] // Row3 with 3 buttons
//       ])
//       .oneTime()
//       .resize()
//       .extra()
//     )
//   })
  
//   bot.hears('🔍 Search', ctx => ctx.reply('Yay!'))
//   bot.hears('📢 Ads', ctx => ctx.reply('Free hugs. Call now!'))
  
//   bot.command('special', (ctx) => {
//     return ctx.reply('Special buttons keyboard', Extra.markup((markup) => {
//       return markup.resize()
//         .keyboard([
//           markup.contactRequestButton('Send contact'),
//           markup.locationRequestButton('Send location')
//         ])
//     }))
//   })
  
//   bot.command('pyramid', (ctx) => {
//     return ctx.reply('Keyboard wrap', Extra.markup(
//       Markup.keyboard(['one', 'two', 'three', 'four', 'five', 'six'], {
//         wrap: (btn, index, currentRow) => currentRow.length >= (index + 1) / 2
//       })
//     ))
//   })
  
//   bot.command('simple', (ctx) => {
//     return ctx.replyWithHTML('<b>Coke</b> or <i>Pepsi?</i>', Extra.markup(
//       Markup.keyboard(['Coke', 'Pepsi'])
//     ))
//   })
  
//   bot.command('inline', (ctx) => {
//     return ctx.reply('<b>Coke</b> or <i>Pepsi?</i>', Extra.HTML().markup((m) =>
//       m.inlineKeyboard([
//         m.callbackButton('Coke', 'Coke'),
//         m.callbackButton('Pepsi', 'Pepsi')
//       ])))
//   })
  
//   bot.command('random', (ctx) => {
//     return ctx.reply('random example',
//       Markup.inlineKeyboard([
//         Markup.callbackButton('Coke', 'Coke'),
//         Markup.callbackButton('Dr Pepper', 'Dr Pepper', Math.random() > 0.5),
//         Markup.callbackButton('Pepsi', 'Pepsi')
//       ]).extra()
//     )
//   })
  
//   bot.command('caption', (ctx) => {
//     return ctx.replyWithPhoto({ url: 'https://picsum.photos/200/300/?random' },
//       Extra.load({ caption: 'Caption' })
//         .markdown()
//         .markup((m) =>
//           m.inlineKeyboard([
//             m.callbackButton('Plain', 'plain'),
//             m.callbackButton('Italic', 'italic')
//           ])
//         )
//     )
//   })
  
//   bot.hears(/\/wrap (\d+)/, (ctx) => {
//     return ctx.reply('Keyboard wrap', Extra.markup(
//       Markup.keyboard(['one', 'two', 'three', 'four', 'five', 'six'], {
//         columns: parseInt(ctx.match[1])
//       })
//     ))
//   })
  
//   bot.action('Dr Pepper', (ctx, next) => {
//     return ctx.reply('👍').then(() => next())
//   })
  
//   bot.action('plain', async (ctx) => {
//     ctx.editMessageCaption('Caption', Markup.inlineKeyboard([
//       Markup.callbackButton('Plain', 'plain'),
//       Markup.callbackButton('Italic', 'italic')
//     ]))
//   })
  
//   bot.action('italic', (ctx) => {
//     ctx.editMessageCaption('_Caption_', Extra.markdown().markup(Markup.inlineKeyboard([
//       Markup.callbackButton('Plain', 'plain'),
//       Markup.callbackButton('* Italic *', 'italic')
//     ])))
//   })
  
//   bot.action(/.+/, (ctx) => {
//     return ctx.answerCbQuery(`Oh, ${ctx.match[0]}! Great choice`)
//   })

//     /*const userId = null;
//     bot.command('register', (ctx) => 
//         userId.telegram.getChatMember(ctx, ctx),
//     );
    
//     console.log(userId);*/


//     // bot.hears('hi', (ctx) => ctx.reply('Hello, stranger!'));
//     // bot.hears(/bye/i, (ctx) => ctx.reply('Bye-bye, stranger!'));
//     // bot.on('sticker', (ctx) => ctx.reply('👍'))
    
    bot.launch()
}
