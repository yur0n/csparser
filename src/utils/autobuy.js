import { Builder, By } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome.js'



export default async (cookie, link) => {
	if (!link) link = 'https://buff.163.com/goods/930483?appid=730&classid=5367597729&instanceid=188530139&assetid=31116172328&contextid=2&sell_order_id=0809892772-70F3-158346853'
    let options = new Options();
    options.addArguments('--headless');
    options.addArguments('--disable-gpu');
	options.addArguments('--no-sandbox');

    let driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

    try {
        // const cookies = JSON.parse(await fs.readFile('cookies.json', 'utf8'));
        
        await driver.get('https://buff.163.com/market/csgo');
        await driver.manage().deleteAllCookies();

		cookie.split(';').map(async c => {
			let [name, value] = c.split('=');
			console.log({ name, value });
			// await driver.manage().addCookie({ name, value });
		});
		return;
        // await driver.manage().addCookie({ name: 'session', value: '1-Z6kP9tlHypQ3qoYXwLhaA8lHJuUYa-aKXJGu8ULFll072023945832' })

        await driver.get(link);
        await driver.sleep(2000);


        const firstButton = await driver.findElement(By.className('i_Btn i_Btn_big btn-buy-order '));
        await firstButton.click();


        await driver.sleep(2000);

        // let script1 = "return document.querySelector('.total_price').innerText;";
        // let script2 = "return document.querySelector('.pay-method-list').childNodes[3].children[1].childNodes[1].childNodes[1].innerText;";
        // let totalPrice = await driver.executeScript(script1);
        // let balance = await driver.executeScript(script2);
        // let final = +balance.split(' ')[1] - +totalPrice.split(' ')[1];
        // console.log(final);
		// console.log(await driver.executeScript(`return document.querySelector('.store-account').children[0].children[0].innerText`))
        const secondButton = await driver.findElement(By.className('i_Btn pay-btn'));
        await secondButton.click();

        await driver.sleep(5000);
        // const btn = await driver.findElement(By.id('ask_seller'));

        const thirdButton = await driver.findElement(By.xpath('//*[@class="i_Btn" and @id="ask_seller"]'));
        await thirdButton.click();

        await driver.sleep(5000);
        // driver.takeScreenshot().then(
        //     function(image, err) {
        //         fs.writeFile('out2.png', image, 'base64', function(err) {
        //             console.log(err);
        //         });
        //     }
        // );
        
    } catch (error) {
        console.error("Ошибка:", error);
    } finally {
        await driver.quit();
    }
}