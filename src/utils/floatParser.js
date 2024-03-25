import User from '../models/user.js';
import { skinIDs } from './getSkinIDs.js'
import autobuy from './autobuy.js';

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

async function getMinPrice(goodsId) {
    const url = `https://buff.163.com/api/market/goods/sell_order?game=csgo&` +
    `goods_id=${goodsId}&page_num=1&sort_by=default&mode=&allow_tradable_cooldown=1`;
    try {
        const response = await fetch(url);
        if (response.ok) {
            const obj = await response.json();
            const items = obj.data.items || [];

            if (items.length >= 4) {
                const fourthItem = items[3];
                const price = parseFloat(fourthItem.price);
                return price;
            }
        }
    } catch (error) {
        console.error(`Error fetching data for goods_id ${goodsId} : ${error.message}`);
        return 0;
    }
}

async function floatparse(goodId, float_min, float_max, cookie) {
    const url = `https://buff.163.com/api/market/goods/sell_order?game=csgo` +
    `&goods_id=${goodId}&page_num=1&sort_by=default&mode=&allow_tradable_cooldown=1` +
    `&min_paintwear=${float_min}&max_paintwear=${float_max}&_=1710318564214`;
    try {
        let data = await getData(url, cookie)
		if (data.error) return data
		const items = data.items || [];
        const goodsInfos = data.goods_infos || {};
        const minPrice = await getMinPrice(goodId);

        const result = [];
        for (const item of items) {
            let price = item.price;
            let name = goodsInfos[goodId].name || '';
            let float = item.asset_info.paintwear;
            const assetid = item.asset_info.assetid;
			const classid = item.asset_info.classid;
			const instanceid = item.asset_info.instanceid;
			const contextid = item.asset_info.contextid;
			const sell_order_id = item.id !== undefined ? item.id : 'N/A';
			const link = `https://buff.163.com/goods/${goodId}?appid=730` +
				`&classid=${classid}&instanceid=${instanceid}&assetid=${assetid}` +
				`&contextid=${contextid}&sell_order_id=${sell_order_id}`;
			const photo = item.asset_info.info?.inspect_mobile_url || item.img_src;

            result.push({
                name,
                float,
                price,
                defaultPrice: minPrice,
                link,
                photo
            });
        }
        return result;
    } catch (error) {
        console.error(error);
        return { error: 'Failed to fetch data' };
    }
}

export default async (skins, buy, steamID) => {
    let { cookie } = await User.findById(steamID, { cookie: 1 , _id: 0 })
    if (!cookie) return { error: 'No cookie provided' }
    const result = [];
    for (const skin of skins) {
        let id = skinIDs[skin.name];
        if (id) {
            let res = await floatparse(id, skin.minFloat, skin.maxFloat, cookie)
            if (res.error) return res
            result.push(res);
            if (buy && res.length) autobuySkins(cookie, res);
        } else {
            result.push([{ wrongName: skin.name }])
        }
        await new Promise(resolve => setTimeout(resolve, 3000));
    }
    return result;
}

async function autobuySkins(cookie, items) {
    for (const item of items) {
        await autobuy(cookie, item.link)
        await new Promise(resolve => setTimeout(resolve, 3000));
    }
}