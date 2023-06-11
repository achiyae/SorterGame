// @provengo summon selenium
// @provengo summon ctrl

function press(color) {
  request(Event('Press', {color: color}))
}

function magnetFailure(color) {
  request(Event('MagnetFailure'))
}

function verifyCounter(color, count) {
  request(Event('VerifyCounter', {color: color, count: count}))
}

function waitForCounter(color, count) {
  request(Event('VerifyCounter', {color: color, count: count}))
}

function pause() {
  Ctrl.doPause()
}