// @provengo summon selenium
// @provengo summon ctrl

function press(color) {
    request(Event('Press', {color: color}))
    session.click('//button[@class="color ' + color + '"]')
}

function magnetFailure(color) {
    request(Event('MagnetFailure'))
    session.click('//button[@class="failure"]')
}

function verifyCounter(color, count) {
  request(Event('VerifyCounter', {color: color, count: count}))
  session.assertText('//div[@id="' + color + '-counter"]', count)
}

function waitForCounter(color, count) {
  request(Event('VerifyCounter', {color: color, count: count}))
  session.waitForVisibility('//div[@id="' + color + '-counter" and text()="'+count+'"]')
}

function pause() {
  Ctrl.doPause()
}