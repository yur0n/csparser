const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs').promises;

async function example() {
    let options = new chrome.Options();
    options.addArguments('--headless');
    options.addArguments('--disable-gpu');

    let driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

    try {
        await driver.get('https://buff.163.com');
        const cookies = JSON.parse(await fs.readFile('cookies.json'));

        for (const cookie of cookies) {
            await driver.manage().addCookie(cookie);
        }

        await driver.get('https://buff.163.com/user-center/profile');

        await driver.manage().setTimeouts({ implicit: 1000 });

        const tLeftElementsWithSteamBind = await driver.findElements(By.css('.steam_bind .t_Left'));

        if (tLeftElementsWithSteamBind.length === 0) {
            console.error("Элементы не найдены");
        } else {
            console.log("Элементы найдены:");

            // Используем Promise.all для параллельного выполнения
            await Promise.all(tLeftElementsWithSteamBind.map(async (element) => {
                const text = await element.getText();
                console.log(text);
            }));
        }
    } catch (error) {
        console.error("Ошибка:", error);
    } finally {
        await driver.quit();
    }
}

example();