// @provengo summon ctrl
// @provengo summon constraints
// @provengo summon selenium


// ANALYZE:   .\provengo.bat analyze -f pdf --style full test
// RUN:       .\provengo.bat run --show-sessions test
// REPORT:    .\provengo.bat report -t testlog test
// SAMPLE:    .\provengo.bat sample test
// ENSEMBLE:    .\provengo.bat ensemble test

let session = new SeleniumSession('S')

//region Test 1a: Click blue and check that counter is incremented
//*****************************************************************
/*bthread('Click blue and check that counter is incremented', function () {
    with (session.start(URL)) {
        verifyCounter({color: 'blue', count: 0})
        press({color: 'blue'})
        verifyCounter({color: 'blue', count: 1})
    }
})*/
//endregion

//region Test 1b: Fix for 1a - wait for counter to be visible.
//***********************************************************
/*bthread('Click blue and wait for counter to be incremented', function () {
    with (session.start(URL)) {
        waitForCounter({color: 'blue', count: 0})
        press({color: 'blue'})
        waitForCounter({color: 'blue', count: 1})
    }
})*/
//endregion

//region Test 2: Click all colors and check that counter is incremented
//*********************************************************************
let colors = ['red', 'blue', 'green']

for (let i = 0; i < colors.length; i++) {
    let color = colors[i]
    bthread('Click ' + color + ' check that counter is incremented', function () {
        with (session.start(URL)) {
            waitForCounter({color: color, count: 0})
            press({color: color})
            waitForCounter({color: color, count: 1})
        }
    })
}
//endregion

//region Test 3: Add constraint - after pressing, block another press until counter is incremented
//************************************************************************************************
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

//region Test 4: Add malfunction - sensor 1 is always green
//*********************************************************
bthread('Enable Always-green malfunction', function () {
    with (session.start(URL)) {
        enableSensorsMalfunction()
        chooseAlwaysGreenMalfunction()
    }
})
//endregion

//region Test 5: Add malfunction - Sensors are noisy
//*************************************************
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

//region Test 6: Add goal for test-suite generation: Reach 3 drop down
//********************************************************************
bthread('wait for 3 drop down', function () {
    waitFor(any(/WaitForCounter/).and(any({count: 1})))
    waitFor(any(/WaitForCounter/).and(any({count: 1})))
    waitFor(any(/WaitForCounter/).and(any({count: 1})))
    Ctrl.doMark('Reached 3 drop down')
})
//endregion

//region Test 7: Add goal for test-suite generation: Drop magnet after picking up
//********************************************************************************
for (let i = 0; i < colors.length; i++) {
    let color = colors[i]
    bthread('magnet failed after picking up', function () {
        waitFor(any(/Press/))
        inParallel(
            function() {
                session.waitForMagnetOn()
            },
            function () {
                let e = waitFor(any(/DropMagnetMalfunction/)
                    .or(any(/EndOfAction/).and(any({eventName: "WaitForCounter", color: color}))))
                if (e.name == 'DropMagnetMalfunction') {
                    Ctrl.doMark('magnet-failed-path')
                }
            })
    })
}
//endregion
