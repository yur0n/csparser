import { Builder, By } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome.js'

export default async (cookie, link) => {
    let driver;

    try {
        let options = new Options();
        options.addArguments('--headless');
        options.addArguments('--disable-gpu');
        options.addArguments('--no-sandbox');
        options.addArguments('--disable-webgl');

        driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

        await driver.get('https://buff.163.com/market/csgo');

		cookie.split(';').map(async c => {
			let [name, value] = c.split('=');
			if (name && value) await driver.manage().addCookie({ name, value });
		});
        // await driver.manage().addCookie({ name: 'session', value: '1-cZteGww_0hykAvkMEnjDF6Yw4RbkHortaBg7KkDtydhW2030409634' })
        await driver.get(link);
        await driver.sleep(2000);
        // driver.takeScreenshot().then(
        //     function(image, err) {
        //         fs.writeFile('out1.png', image, 'base64', function(err) {
        //             console.log(err);
        //         });
        //     }
        // );
        const buyBtn = await driver.findElement(By.className('i_Btn i_Btn_big btn-buy-order'));
        await buyBtn.click();
        await driver.sleep(2000);
        // try {
        //     let script1 = "return document.querySelector('.total_price').innerText;";
        //     let script2 = "return document.querySelector('.pay-method-list').childNodes[3].children[1].childNodes[1].childNodes[1].innerText;";
        //     let totalPrice = await driver.executeScript(script1);
        //     let balance = await driver.executeScript(script2);
        //     let final = +balance.split(' ')[1] - +totalPrice.split(' ')[1];
        //     console.log(final);
        //     console.log(await driver.executeScript(`return document.querySelector('.store-account').children[0].children[0].innerText`))
        // }
        // catch (e) {
        // }
        const payBtn = await driver.findElement(By.className('i_Btn pay-btn'));
        await payBtn.click();
        await driver.sleep(3000);
        const askSellerBtn = await driver.findElement(By.xpath('//*[@class="i_Btn" and @id="ask_seller"]'));
        await askSellerBtn.click();
        // await driver.sleep(5000);
        // driver.takeScreenshot().then(
        //     function(image, err) {
        //         fs.writeFile('out2.png', image, 'base64', function(err) {
        //             console.log(err);
        //         });
        //     }
        // );
        return true;
    } catch (e) {
        console.error(e.message);
        return false;
    } finally {
        await driver.quit();
    }
}