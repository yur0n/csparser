window.addEventListener("message", (event) => {
	if (event?.data?.message === "Message from the page") {
		parseSend()
	}
});


async function parseSend() {
	let goodsId = localStorage.getItem('goodsId')
	if (!goodsId) return console.log('No goodsId found')
	let data = await parse(goodsId)
	let minProfit = localStorage.getItem('minProfit'), 
		stickerOverpay = localStorage.getItem('stickerOverpay');
	fetch('http://localhost:8080/parse', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ data, minProfit, stickerOverpay, goodsId })
	})
} 

async function parse(goodsId) {
	const url2 = 'https://buff.163.com/api/market/goods/sell_order?game=csgo&goods_id=857652&page_num=1&sort_by=created.desc&mode=&allow_tradable_cooldown=1&_=1710146946248'
    const url = `https://buff.163.com/api/market/goods/sell_order?game=csgo&goods_id=${goodsId}&page_num=1&sort_by=default&mode=&allow_tradable_cooldown=1`;
    try {

		await fetch(url2, {
			redirect: "follow",
            headers: {
				'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
				'Accept-Encoding': 'gzip, deflate, br, zstd',
				'Accept-Language': 'en,en-US;q=0.9,ru-RU;q=0.8,ru;q=0.7',
				'Cache-Control': 'max-age=0',
				'Connection': 'keep-alive',
				'Cookie': 'Device-Id=1M3bFAE5XkrQ8mDxj4Fv; Locale-Supported=en; game=csgo; AQ_HD=1; YD_SC_SID=166E71C249634659869EEFA4C100891C; NTES_YD_SESS=F71CxtckLiZg.nAEKbEg1CLey73PR4oJ2pr5__9KCN0gGaiKjR9Z8QD05RIWD2nclo7Rx9pHZ731_fQszv92JJvIo9O6xJYGdZUXd7bTpu1k9CTXb82mNwDR5t7wCln594fu4im7npOFYw1mzJKN9ONdmqFJgGjSn8q._XRFiW0J2qlFjLBdHgvP5nyxlRlzY8SfDSkcYE_yYFnqWJaU_Ff5St5.qo9ZrMQGzYxjOWxKV; S_INFO=1710240191|0|0&60##|33-756497040; P_INFO=33-756497040|1710240191|1|netease_buff|00&99|null&null&null#UA&null#10#0|&0||33-756497040; remember_me=U1076073300|21BkdgwOlk6lZIOyAxQpN4oxrPz2XwgU; session=1-4YzpefVYPrOqljeUgBatEOYSYSyDuTDT0P5H1rJ6CC6J2028801036; csrf_token=IjQwYWZjYTQ1Y2RjYzczNzcxMGVjNDcwMzdlYTBjYzhkZDYxZmNjYzQi.GNHGlQ.i5HZTB9BIgtUQ62P9wJnVNOGI4k',
				'DNT': '1',
				'Host': 'buff.163.com',
				'Sec-Fetch-Dest': 'document',
				'Sec-Fetch-Mode': 'navigate',
				'Sec-Fetch-Site': 'none',
				'Sec-Fetch-User': '?1',
				'Upgrade-Insecure-Requests': '1',
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
				'sec-ch-ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
				'sec-ch-ua-mobile': '?0',
				'sec-ch-ua-platform': 'Windows'
            } 
        }).then(res => res.json()).then(console.log).catch(error => console.log(error))
        const response = await fetch(url, {
            headers: {
                'Accept-Language': 'en'
            } 
        });
        if (response.ok) {
            const { data } = await response.json();
            if (!data?.items.length) return { error: 'Wrong Item ID'}
			return data
        } else {
            console.error('Failed to fetch data:', response.statusText);
            return { error: 'Failed to fetch data' };
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        return { error: 'Error fetching data' };
    }
}