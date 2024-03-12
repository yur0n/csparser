import User from '../models/user.js'

export default async (id, goodsId) => {
	let { cookies } = await User.findById(id)
	let useCookie = ''
	for (const cookie of cookies) {
		if (cookie.domain == 'buff.163.com') {
			if (cookie.name === 'session' || cookie.name === 'Device-Id' ||
			cookie.name === 'remember_me' || cookie.name === 'csrf_token') {
				useCookie += `${cookie.name}=${cookie.value};`
			}
		}
	}
	let url = `https://buff.163.com/api/market/goods/sell_order?game=csgo&goods_id=${goodsId}&page_num=1&sort_by=created.desc&mode=&allow_tradable_cooldown=1&_=1710146946248`
	await fetch('https://buff.163.com').catch(console.log);
	await new Promise(resolve => setTimeout(resolve, 4000));
	await fetch(url, {
		headers: { 
			'Accept-Language': 'en',
			Cookie: useCookie 
		} 
	}).then(res => res.json()).then(data => console.log(data.data.items[0])).catch(console.log);

}

