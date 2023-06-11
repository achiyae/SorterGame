// @provengo summon ctrl
// @provengo summon constraints
// @provengo summon selenium


// ANALYZE:   .\provengo.bat analyze -f pdf --style full test
// RUN:       .\provengo.bat run --show-sessions test
// REPORT:    .\provengo.bat report -t testlog test

let session = new SeleniumSession('S')

//region Test 1a.
/*bthread('Click blue and check that counter is incremented', function () {
    let s = session.start(URL)
    verifyCounter('blue', 0)
    press('blue')
    verifyCounter('blue', 1)
})*/
//endregion

//region Test 1b.
/*bthread('Click blue and check that counter is incremented', function () {
    session.start(URL)
    waitForCounter('blue', 0)
    press('blue')
    waitForCounter('blue', 1)
})*/
//endregion

//region Test 2.
let colors = ['red', 'blue', 'green']

for (let i = 0; i < colors.length; i++) {
    let color = colors[i]
    bthread('Click ' + color + ' 3 times and check that counter is incremented', function () {
        // let s = waitFor(any(/StartSession/))
        session.start(URL)
        waitForCounter('blue', 0)
        press(color)
        waitForCounter(color, 1)
    })
}
//endregion

//region Test 3.

//endregion

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
