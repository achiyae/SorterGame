// @provengo summon ctrl
// @provengo summon constraints
// @provengo summon selenium


// ANALYZE:   .\provengo.bat analyze -f pdf --style full test
// RUN:       .\provengo.bat run --show-sessions test
// REPORT:    .\provengo.bat report -t testlog test
// SAMPLE:    .\provengo.bat sample test
// ENSEMBLE:    .\provengo.bat ensemble test

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

//region Test 4.
bthread('Enable Always-green malfunction', function () {
    with (session.start(URL)) {
        enableSensorsMalfunction()
        chooseAlwaysGreenMalfunction()
    }
})
//endregion

//region Test 5.
bthread('Enable Noise malfunction', function () {
    with (session.start(URL)) {
        enableSensorsMalfunction()
        chooseNoiseMalfunction()
    }
})

bthread('Drop Magnet malfunction', function () {
    with (session.start(URL)) {
        dropMagnetMalfunction()
    }
})
//endregion

//region Test 6.
// Mark goals for ensemble
/*for (let i = 0; i < colors.length; i++) {
    let color = colors[i]
    bthread('magnet failed after picking up', function () {
        with (session.start(URL)) {
            waitForMagnetOn()
            let e = waitFor(any(/DropMagnetMalfunction/)
                .or(any(/EndOfAction/).and(any({eventName: "WaitForCounter", color: color}))))
            if (e.name=='DropMagnetMalfunction') {
                Ctrl.doMark('magnet-failed-path')
            }
        }
    })
}*/
bthread('wait for 3 drop down', function () {
    waitFor(any(/WaitForCounter/).and(any({count: 1})))
    waitFor(any(/WaitForCounter/).and(any({count: 1})))
    waitFor(any(/WaitForCounter/).and(any({count: 1})))
    Ctrl.doMark('Reached 3 drop down')
})
//endregion
