// @provengo summon selenium
// @provengo summon ctrl

let press;
defineEvent(SeleniumSession, "Press", function (session, event) {
    session.click('//button[@class="color ' + event.color + '"]')
})

let magnetFailure;
defineEvent(SeleniumSession, "MagnetFailure", function (session, event) {
    session.click('//button[@class="failure"]')
})

let verifyCounter;
defineEvent(SeleniumSession, "VerifyCounter", function (session, event) {
    session.assertText('//div[@id="' + event.color + '-counter"]', event.count)
})

let waitForCounter;
defineEvent(SeleniumSession, "WaitForCounter", function (session, event) {
    session.waitForVisibility('//div[@id="' + event.color + '-counter" and text()="' + event.count + '"]', 6000)
})

let enableSensorsMalfunction;
defineEvent(SeleniumSession, "EnableSensorsMalfunction", function (session, event) {
    session.click('//input[@id="disableSensorsRadios"]')
})

let chooseAlwaysGreenMalfunction;
defineEvent(SeleniumSession, "ChooseAlwaysGreenMalfunction", function (session, event) {
    session.click('//input[@id="always-green"]')
})

let chooseNoiseMalfunction;
defineEvent(SeleniumSession, "ChooseNoiseMalfunction", function (session, event) {
    session.click('//input[@id="noise"]')
})

let dropMagnetMalfunction;
defineEvent(SeleniumSession, "DropMagnetMalfunction", function (session, event) {
    session.click('//button[@id="drop-magnet"]')
})

let waitForMagnetOn;
defineEvent(SeleniumSession, "waitForMagnetOn", function (session, event) {
    session.waitForVisibility('//p[@id="robot-value-magnet" and text()="On"]', 6000)
})