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

let enableSensorsMalfunction;
defineEvent(SeleniumSession, "EnableSensorsMalfunction", function (session, event) {
})

let chooseAlwaysGreenMalfunction;
defineEvent(SeleniumSession, "ChooseAlwaysGreenMalfunction", function (session, event) {
})

let chooseNoiseMalfunction;
defineEvent(SeleniumSession, "ChooseNoiseMalfunction", function (session, event) {
})

let dropMagnetMalfunction;
defineEvent(SeleniumSession, "DropMagnetMalfunction", function (session, event) {
})