import { Browser, Builder, By, ThenableWebDriver, until } from "selenium-webdriver"
import fs from "fs"
import path from "path"
import moment from "moment"
import chrome from "selenium-webdriver/chrome"

let driver: ThenableWebDriver;
let screenshotIntervalId: NodeJS.Timeout;
export async function run(url: string) {
    try {
        await driver.quit();
    }
    catch (err) {
        console.log("Error druing closing window");
    }
    try {

        const chromeOptions = new chrome.Options();
        const extensionPath = path.resolve(__dirname, "../extension");
        chromeOptions.addArguments(`load-extension=${extensionPath}`)

        driver = new Builder().forBrowser(Browser.CHROME).setChromeOptions(chromeOptions).build();
        await driver.get(url);
        driver.wait(until.elementLocated(By.id("helloworld")), 20000000).catch(err => {
            console.error("Error during run function");
        });
    }
    catch (err) {
        console.error("Error during run function");
    }
}


export async function exit() {
    await driver.quit();
}

export async function isOpened() {
    try {
        // await driver.executeScript("return document.readyState");
        console.log(await driver.getWindowHandle())
    }
    catch(err) {
        return false;
    }
    return true;
}


export async function startScreenShot(dir: string){
    screenshotIntervalId = setInterval(async () => {
        try {
            const screenshot = await driver.takeScreenshot();
            const filePath = path.join(dir, moment().format("YYYY-MM-DD-HH-mm-ss") + ".png");
            await fs.promises.mkdir(dir, { recursive: true });
            fs.writeFileSync(filePath, Buffer.from(screenshot, 'base64'));
            console.log("file saves at " + filePath);
        }
        catch(err){
            console.log("Error occured during screenshot");
        }

    }, 5000);
};

export async function stopScreenShopt() {
    clearInterval(screenshotIntervalId);
}