const { Bot } = require('grammy')
const {Subscriber} = require('./models/subscriber.js')

const bot = new Bot(process.env.BOT_ADMIN || '1883716013:AAF6aaTD5CntA2t7IeL3VGfdBmpqQuSCYV8')


bot.command('start', async ctx => {
    ctx.reply('Бот-админ для добавления подписчиков')
})

bot.on('message',  async ctx => {
    let user = await Subscriber.findOne({id: ctx.msg.text})
    if (user) {
        ctx.reply(`${ctx.msg.text} уже был добавлен`)
    } else {
        let subscriber = new Subscriber({ id: ctx.msg.text})
        await subscriber.save().catch((error) => {
			console.log('Bot admin error:', error)
			ctx.reply(`Ошибка с базой данных`)
		})
        ctx.reply(`Подписчик добавлен`) 
	}
})

bot.catch((err) => {
	console.log(err)
});

process.once("SIGINT", () => bot.stop());
process.once("SIGTERM", () => bot.stop());


bot.start()