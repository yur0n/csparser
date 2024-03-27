import { Bot } from 'grammy'
import Subscriber from '../models/subscriber.js'

let bot = new Bot(process.env.BOT_NOTIFIER)
bot.api.setMyCommands([{ command: 'start', description: 'Start bot' } ])

bot.command('start', async (ctx) => {
    await ctx.reply('Привет, я буду присылать вам уведомления о новых товарах\n\nДля начала работы пришлите мне свой SteamID')
})

bot.on('message', async (ctx) => {
    const checkID = (id) => /^[0-9]{17}$/.test(id)
    if (checkID(ctx.message.text)) {
        let sub = Subscriber.findById(ctx.message.text)
        if (!sub) {
            await ctx.reply('У вас отсутствует подписка на сервис, для продолжения работы приобретите подписку')
            return
        }
        await ctx.reply('SteamID принят.\n\nBаш ChatID: ' + ctx.message.chat.id)
        await ctx.reply('Для включения уведомлений введите ChatID на сайте\n\nДля отключения уведомлений просто очистите поле ChatID')
    } else {
        await ctx.reply('Не верный SteamID')
    }
})

bot.start()

async function sendToBotStickers (data, chatId) {
    let can_send_to_bot = true
    for (const items of data) {
        if (!items.length) continue;
        for (const item of items) {
            if (item.wrongName) continue;
            let message = `
                \n${item.name}
                \nItem price: ¥${item.defaultPrice}
                \nProfit: 🔥 ${item.roundedProfit}% 🔥
                \nStickers total price: ¥${item.total_sticker_price}
                \nAutobuy Status: ${item.buyStatus ? 'bought successfuly' : 'not bought'}
                \nStickers:
                `;
            item.stickers.forEach(sticker => {
                message += `\n- ${sticker.name}: ¥${sticker.price}`;
            });

            await bot.api.sendPhoto(chatId, item.photo, {
                caption: message,
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '💰  BUY  💰', url: item.link }]
                    ]
                }
            })
            .catch(() => can_send_to_bot = false)
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
}

async function sendToBotFloat (data, chatId) {
    let can_send_to_bot = true
    for (const items of data) {
        if (!items.length) continue;
        for (const item of items) {
            if (item.wrongName) continue;
            let message = `
                \n${item.name}
                ${item.float ? `\nFloat: ${item.float}` : ''}
                \nPrice: ¥${item.price}
                \nAutobuy Status: ${item.buyStatus ? 'bought successfuly' : 'not bought'}
                `;
                // \nDefault Price: ¥${item.defaultPrice}
            await bot.api.sendPhoto(chatId, item.photo, {
                caption: message,
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '💰  BUY  💰', url: item.link }]
                    ]
                }
            })
            .catch(() => can_send_to_bot = false)
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
}

export { sendToBotStickers, sendToBotFloat }