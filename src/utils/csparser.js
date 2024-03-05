import { readFileSync } from 'fs';
import fetch from 'node-fetch';

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


export default async (goodsId, minProfit, stickerOverpay) => {
    const url = `https://buff.163.com/api/market/goods/sell_order?game=csgo&goods_id=${goodsId}&page_num=1&sort_by=default&mode=&allow_tradable_cooldown=1`;

    try {
        const response = await fetch(url, {
            headers: {
                'Accept-Language': 'en'
            }
        });
        if (response.ok) {
            const data = await response.json();
            const items = data.data.items || [];
            const name = data.data.goods_infos[goodsId].name || '';
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
                const inspect_mobileurl = item.asset_info.info.inspect_mobile_url ? item.asset_info.info.inspect_mobile_url : 'N/A';

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
                const profit = ((sticker_profit - (item.price - item.price)) / item.price) * 100; 
                const roundedProfit = profit.toFixed(2);
                if (roundedProfit > minProfit) {
                    result.push({
                        goodsId,
                        defaultPrice: item.price,
                        name,
                        stickers: processedStickers,
                        link,
                        inspect_mobileurl,
                        total_sticker_price: totalStickerPrice.toFixed(2),
                        roundedProfit
                    });
                }
            }
            return result;
        } else {
            console.error('Failed to fetch data:', response.statusText);
            return null;
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

