// @provengo summon ctrl
// @provengo summon constraints
// @provengo summon selenium


// ANALYZE:   .\provengo.bat analyze -f pdf --style full test
// RUN:       .\provengo.bat run --show-sessions test
// REPORT:    .\provengo.bat report -t testlog test

let session = new SeleniumSession('S')

//region Test 1a.
/*bthread('Click blue and check that counter is incremented', function () {
    with (session.start(URL)) {
        verifyCounter({color: 'blue', count: 0})
        press({color: 'blue'})
        verifyCounter({color: 'blue', count: 1})
    }
})*/
//endregion

//region Test 1b.
/*bthread('Click blue and wait for counter to be incremented', function () {
    with (session.start(URL)) {
        waitForCounter({color: 'blue', count: 0})
        press({color: 'blue'})
        waitForCounter({color: 'blue', count: 1})
    }
})*/
//endregion

//region Test 2.
let colors = ['red', 'blue', 'green']

for (let i = 0; i < colors.length; i++) {
    let color = colors[i]
    bthread('Click ' + color + ' 3 times and check that counter is incremented', function () {
        with (session.start(URL)) {
            waitForCounter({color: color, count: 0})
            press({color: color})
            waitForCounter({color: color, count: 1})
        }
    })
}
//endregion

//region Test 3.
for (let i = 0; i < colors.length; i++) {
    let color = colors[i]
    Constraints
        .after(any(/Press/).and(any({color: color})))
        .block(any(/Press/))
        .until(
            any(/EndOfAction/).and(any({eventName: "WaitForCounter", color: color}))
        );
}
//endregion


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
