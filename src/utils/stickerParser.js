import User from '../models/user.js';
import { pricesDict, skinIDs } from './getSkinIDs.js'


async function getData(url, cookie, attempt = 0) { 
	if (attempt >= 2) return { error: 'Buff163 Login Required' }
	const response = await fetch(url, {
		headers: { 
			'Accept-Language': 'en',
			Cookie: cookie
		} 
	})
	if (response.ok) {
		let res = await response.json()
		if (res.code !== 'OK') console.log(new Date().toISOString() + ': ', res)
		if (res.code == 'Captcha Validate Required') {
			return { error: res.code, url: res.confirm_entry.entry.url }
		}
		else if (res.code == 'Action Forbidden') {
			return { error: res.code + res.error }
		}
		else if (res.code == 'Login Required') {
			await new Promise(resolve => setTimeout(resolve, 2000));
			return await getData(url, cookie, attempt + 1)
		} else if (res.code == 'OK'){
			return res.data
		}
	} else {
		console.error('Failed to fetch data:', response.statusText);
		return { error: 'Failed to fetch data: ' + response.statusText };
	}
}

async function parseStickers(goodsId, minProfit, stickerOverpay, cookie) {
	try {
		let url = `https://buff.163.com/api/market/goods/sell_order?game=csgo` +
		`&goods_id=${goodsId}&page_num=1&sort_by=created.desc&mode=` +
		`&allow_tradable_cooldown=1&_=1710146946248`
		
		let data = await getData(url, cookie)
		if (data.error) return data
		const items = data.items || [];
		const name = data.goods_infos[goodsId].name || '';
		const result = [];

		let minPrice = 0;
		if (items.length >= 4) {
			const fourthItem = items[3];
			minPrice = parseFloat(fourthItem.price);
		}

		for (const item of items) {
			const stickers = item.asset_info.info.stickers || [];
			const assetid = item.asset_info.assetid;
			const classid = item.asset_info.classid;
			const instanceid = item.asset_info.instanceid;
			const contextid = item.asset_info.contextid;
			const sell_order_id = item.id !== undefined ? item.id : 'N/A';
			const link = `https://buff.163.com/goods/${goodsId}?appid=730` +
				`&classid=${classid}&instanceid=${instanceid}&assetid=${assetid}` +
				`&contextid=${contextid}&sell_order_id=${sell_order_id}`;
			const photo = item.asset_info.info?.inspect_mobile_url || item.img_src;

			let totalStickerPrice = 0;
			const processedStickers = [];

			for (const sticker of stickers) {
				if (sticker.wear === 0) {
					const stickerPrice = parseFloat(pricesDict[sticker.name]) || 0;
					totalStickerPrice += stickerPrice;
					processedStickers.push({ name: sticker.name || 'N/A', price: stickerPrice });
				} else {

					processedStickers.push({ name: sticker.name || 'N/A', price: 'потертая' });
				}
			}

			const sticker_profit = totalStickerPrice / stickerOverpay;
			let profit = (sticker_profit / item.price) * 100;
			if (isNaN(profit) || !isFinite(profit)) profit = 0
			const roundedProfit = profit.toFixed(2);
			if (roundedProfit > +minProfit) {
				result.push({
					goodsId,
					defaultPrice: item.price,
					name,
					stickers: processedStickers,
					link,
					photo,
					total_sticker_price: totalStickerPrice.toFixed(2),
					roundedProfit
				});
			}
		}
		return result;
    } catch (error) {
        console.error('Error fetching data:', error);
        return { error: 'Error fetching data' };
    }
}

export default async (skins, minProfit, stickerOverpay, steamID) => {
	let { cookie } = await User.findById(steamID, { cookie: 1 , _id: 0 })
	if (!cookie) return { error: 'No cookie provided' }
	const result = [];

	for (const skin of skins) {
		let id = skinIDs[skin];
		if (id) {
            let res = await parseStickers(id, minProfit, stickerOverpay, cookie)
			if (res.error) return res
            result.push(res);
        } else {
			result.push([{ wrongName: skin }])
		}
		await new Promise(resolve => setTimeout(resolve, 3000));
	}
	return result
}

