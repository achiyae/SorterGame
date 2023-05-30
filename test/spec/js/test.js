// @provengo summon ctrl
// @provengo summon constraints
// @provengo summon selenium


// ANALYZE:   .\provengo.bat analyze -f pdf --style full test
// RUN:       .\provengo.bat run --show-sessions test

/*bthread('Click red and check that counter is incremented', function () {
  let s = getSession().start(URL)
  verifyCounter(s, 'red', 0)
  press(s, 'red')
  verifyCounter(s, 'red', 1)
})*/

/*bthread('Click red 3 times and check that counter is incremented', function () {
  let s = getSession().start(URL)
  verifyCounter(s, 'red', 0)
  for (let i = 0; i < 3; i++) {
    press(s, 'red')
    verifyCounter(s, 'red', i+1)
  }
})*/

bthread('Start session', function () {
  getSession().start(URL)
})
for(let color of ['red', 'green', 'blue'] ) {
  bthread('Click three colors and check relevant counters is incremented', function () {
    let s = waitFor(Any(/StartSession/) )
    verifyCounter(s, color, 0)
    for (let i = 0; i < 3; i++) {
      press(s, color)
      verifyCounter(s, color, i+1)
    }
  })
}

/*story('Block red after the first press', function () {
  waitFor(any(/^Press/)) // wait for any event whose name starts with "Press"
  block(any(/PressRed/)) // block "choose" calls from selecting "Mars"
})*/

/*bthread('Mark Green', function () {
  waitFor(any('PressGreen'))
  Ctrl.doMark('Green Path!')
})*/

/**
 * (advanced)
 * Uncomment to create the following general requirement:
 *  It should not be possible to say "Hi, Venus". If a scenario allows this, complain informatively.
 */
//bthread("Hi Venus is a spec error", function(){
//    waitFor(bp.Event("Hi, Venus"));
//    bp.ASSERT(false, "Spec Error: Saying 'Hi' to Venus should not be possible");
//});

/**
 * Block saying "Hi" to Venus.
 * Un-comment to ensure no scenario violates the above requirement.
 */
// Constraints.after(choiceEvent("Hi"))
//     .block(choiceEvent("Venus"))
//     .forever();
