// @provengo summon selenium
// @provengo summon ctrl

let press;
defineEvent(SeleniumSession, "Press", function (session, event) {
})

let magnetFailure;
defineEvent(SeleniumSession, "MagnetFailure", function (session, event) {
})

let verifyCounter;
defineEvent(SeleniumSession, "VerifyCounter", function (session, event) {
})

let waitForCounter;
defineEvent(SeleniumSession, "WaitForCounter", function (session, event) {
})

function pause() {
    Ctrl.doPause()
}