export async function deleteMsg(ctx, chat, msg) {
	try {
		await ctx.api.deleteMessage(chat, msg)
	} catch (e) {}
}

export async function deleteMsgTime(ctx, chat, msg, time = 2500) {
	setTimeout(async () => {
		try {
			await ctx.api.deleteMessage(chat, msg);
		} catch (e) {}
	}, time);
}

export async function replyAndDel(ctx, text, time = 2500) {
	const msg = await ctx.reply(text)
	setTimeout(async () => {
		try {
			await ctx.api.deleteMessage(msg.chat.id, msg.message_id)
		} catch (e) {}
	}, time)
}