import { Menu } from "@grammyjs/menu"

const main = new Menu('main-menu')
	.text('➕ Добавить', async ctx => {
		await ctx.conversation.enter('addSub')
	})
	.text('❌ Удалить', async ctx => {
		await ctx.conversation.enter('deleteSub')
	}).row()
    .text('✏️ Изменить', async ctx => {
		await ctx.conversation.enter('updateSub')
	})
	.url('👥 Все подписчики', 'http://yuron.xyz:8080/allsubs?token=ht2a33B4EQ4226dpH')

export default main