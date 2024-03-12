import { readFileSync } from 'fs';
import User from '../models/user.js';

const pricesDict = {};
const idsData = readFileSync("src/utils/ids", "utf-8");
idsData.split("\n").forEach((line) => {
    const parts = line.split(",");
    if (parts.length === 3) {
        const stickerId = parts[0].trim();
        const stickerName = parts[1].trim();
        const stickerPrice = parseFloat(parts[2].trim());
        pricesDict[stickerName] = stickerPrice;
    }
});

async function getData(url, cookie, attempt = 0) { 
	if (attempt >= 2) return { error: 'Buff163 Login Required error' }
	const response = await fetch(url, {
		headers: { 
			'Accept-Language': 'en',
			Cookie: cookie
		} 
	})
	if (response.ok) {
		let res = await response.json()
		if (res.code == 'Login Required') {
			await new Promise(resolve => setTimeout(resolve, 3000));
			return await getData(url, cookie, attempt + 1)
		} else {
			console.log(res)
			console.log(res.data?.items?.length)
			if (!res.data?.items?.length) return { error: 'Wrong Item ID'}
			return res.data
		}
	} else {
		console.error('Failed to fetch data:', response.statusText);
		return { error: 'Failed to fetch data' };
	}
}

export default async (goodsId, minProfit, stickerOverpay, steamID) => {
	try {
		let { cookie } = await User.findById(steamID, { cookie: 1 , _id: 0 })
		if (!cookie) return { error: 'No cookie' }

		let url = `https://buff.163.com/api/market/goods/sell_order?game=csgo&goods_id=${goodsId}&page_num=1&sort_by=created.desc&mode=&allow_tradable_cooldown=1&_=1710146946248`
		
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
			const link = `https://buff.163.com/goods/${goodsId}?appid=730&classid=${classid}&instanceid=${instanceid}&assetid=${assetid}&contextid=${contextid}&sell_order_id=${sell_order_id}`;
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
			// add minPrice algorithm later const profit = ((sticker_profit - (item.price - minPrice)) / item.price) * 100; 
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

