// @provengo summon selenium
// @provengo summon ctrl

function press(session, color) {
    request(Event('Press', {color: color}))
    session.click('//button[@class="' + color + '"]')
    Ctrl.doSleep(5000)
}

function verifyCounter(session, color, count) {
  request(Event('VerifyCounter', {color: color, count: count}))
  session.assertText('//div[@id="' + color + '-counter"]', count)
}

function getSession() {
  return new SeleniumSession('S')
}

function pause() {
  Ctrl.doPause()
}

function sleep(millis) {
  Ctrl.doSleep(millis)
}