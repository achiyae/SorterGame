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
    session.waitForVisibility('//div[@id="' + event.color + '-counter" and text()="' + event.count + '"]')
})

function pause() {
    Ctrl.doPause()
}