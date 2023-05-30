// @provengo summon selenium
// @provengo summon ctrl

defineEvent(SeleniumSession, 'Press', function (session, event) {
})

defineEvent(SeleniumSession, 'VerifyCounter', function (session, event) {
  with (session) {
    assertText('//div[@id="' + event.color + '-counter"]', event.count)
  }
})

function pause() {
  Ctrl.doPause(millis)
}

function sleep(millis) {
  Ctrl.doSleep(millis)
}