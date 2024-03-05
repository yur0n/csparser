import Subscriber from '../../models/subscriber.js'
import { InlineKeyboard } from 'grammy'
import { replyAndDel, deleteMsg, deleteMsgTime } from './functions.js'

const setSubTime = (days) => {
	days = Math.min(Math.max(days, 1), 10000)
	return new Date(Date.now() + (days * 24 * 3600 * 1000))
}

const checkID = (id) => /^[0-9]{17}$/.test(id)

export async function addSub(conversation, ctx) {
	try {
		let ask = await ctx.reply('⌨️ Введите SteamID подписчика', {
			reply_markup: new InlineKeyboard().text('🚫 Отменить')
		}); 
		ctx = await conversation.wait();
		deleteMsg(ctx, ask.chat.id, ask.message_id)
		if (ctx.update.callback_query?.data) return
		let id = ctx.msg.text; 
		if (!checkID(id)) {
			replyAndDel(ctx, `⚠️ Неверное значение SteamID`)
			return
		}
		let ask2 = await ctx.reply('⌨️ Введите дни подписки');
		ctx = await conversation.wait();
		deleteMsg(ctx, ask2.chat.id, ask2.message_id)
		let ttl = ctx.msg.text;
		if (isNaN(ttl)) {
			replyAndDel(ctx, `⚠️ Неверное значение`)
			return
		}
		let subscriber = await Subscriber.findOne({ id })
		if (subscriber) {
			replyAndDel(ctx, `ℹ️ Подписчик ${id} уже был добавлен`)
		} else {
			let subscriber = new Subscriber({ id, expirationDate: setSubTime(ttl) })
			await subscriber.save()
			replyAndDel(ctx, `✅ Подписчик добавлен`) 
		}
	} catch (error) {
		console.log('Bot admin error:', error)
		replyAndDel(ctx, `Ошибка с базой данных`)
	}
}

export async function deleteSub(conversation, ctx) {
	try {
		let ask = await ctx.reply('⌨️ Введите SteamID подписчика', {
			reply_markup: new InlineKeyboard().text('🚫 Отменить')
		});
		ctx = await conversation.wait();
		deleteMsg(ctx, ask.chat.id, ask.message_id)
		if (ctx.update.callback_query?.data) return
		let id = ctx.msg.text;
		if (!checkID(id)) {
			replyAndDel(ctx, `⚠️ Неверное значение SteamID`)
			return
		}
		let subscriber = await Subscriber.findOne({ id })
		if (subscriber) {
			await subscriber.deleteOne()
			replyAndDel(ctx, `✅ Подписчик ${id} удален`)
		} else {
			replyAndDel(ctx, `ℹ️ Подписчик ${id} не найден`)
		}
	} catch (error) {
		console.log('Bot admin error:', error)
		replyAndDel(ctx, `Ошибка с базой данных`)
	}
}

export async function updateSub(conversation, ctx) {
	try {
		let ask = await ctx.reply('⌨️ Введите SteamID подписчика', {
			reply_markup: new InlineKeyboard().text('🚫 Cancel')
		});
		ctx = await conversation.wait();
		deleteMsg(ctx, ask.chat.id, ask.message_id)
		if (ctx.update.callback_query?.data) return
		let id = ctx.msg.text;
		if (!checkID(id)) {
			replyAndDel(ctx, `⚠️ Неверное значение SteamID`)
			return
		}
		let subscriber = await Subscriber.findOne({ id })
		if (subscriber) {
			let ask2 = await ctx.reply('⌨️ Введите новое количество дней подписки');
			ctx = await conversation.wait();
			deleteMsg(ctx, ask2.chat.id, ask2.message_id)
			let ttl = ctx.msg.text;
			if (isNaN(ttl)) {
				replyAndDel(ctx, `⚠️ Неверное значение`)
				return
			}
			await subscriber.updateOne({ expirationDate: setSubTime(ttl) })
			replyAndDel(ctx, `✅ Подписчик ${id} обновлен`)
		} else {
			replyAndDel(ctx, `ℹ️ Подписчик ${id} не найден`)
		}
	} catch (error) {
		console.log('Bot admin error:', error)
		replyAndDel(ctx, `Ошибка с базой данных`)
	}
}