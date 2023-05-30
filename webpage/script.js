const DURATION = 500
function updateRobotLocation() {
    $('#robot-value-x').text(Math.round($('#robot').offset().left))
    $('#robot-value-y').text(Math.round($('#robot').offset().top))
}

function updateRobotEngine(h, v) {
    if(!h) h = 0
    if(!v) v = 0
    $('#robot-value-motor-h').text(h)
    $('#robot-value-motor-v').text(v)
}

function updateRobotMagnet(v) {
    if(!v) v = false
    if(!v){
        $('#robot-value-magnet').text('Off').css("background-color", 'transparent')
    } else {
        $('#robot-value-magnet').text('On').css("background-color", '#51EF51FF')
    }
}

function move(color) {
    var robot = document.getElementById('robot')
    var robotBlock = document.getElementById('robot-block')
    var blocks = document.getElementsByClassName('block ' + color)
    var coloredPile = document.getElementsByClassName('pile ' + color + '-b')[0]
    var counter = document.getElementById(color + '-counter')
    var lastTransparentBlock = coloredPile.querySelectorAll('.pile-block.transparent')[0]
    var count = parseInt(counter.innerHTML)

    if (blocks.length > 0) {
        var firstBlock = blocks[0]
        var blockLeft = firstBlock.offsetLeft - robot.offsetLeft
        var blockTop = firstBlock.offsetTop - robot.offsetTop - 31
        var pileLeft = coloredPile.offsetLeft - firstBlock.offsetLeft + 7
        var pileTop = lastTransparentBlock.offsetTop - robot.offsetTop - 32 - count

        $("#robot")
            .animate({left: "+=" + blockLeft + "px",},
                {
                    duration: DURATION,
                    step: function (now, tween) {
                        updateRobotLocation()
                    },
                    start: function () {
                        updateRobotEngine(-10, 0)
                    },
                    complete: function () {
                        updateRobotEngine(0, 0)
                    }
                })
            .animate({top: "+=" + blockTop + "px",},
                {
                    duration: DURATION,
                    step: function (now, tween) {
                        updateRobotLocation()
                    },
                    start: function () {
                        updateRobotEngine(0, -10)
                    },
                    complete: function () {
                        updateRobotEngine(0, 0)
                        updateRobotMagnet(true)
                        firstBlock.className = 'block transparent'
                        robotBlock.className = 'block ' + color
                    }
                })
            .animate({top: "-40px",},
                {
                    duration: DURATION,
                    step: function (now, tween) {
                        updateRobotLocation()
                    },
                    start: function () {
                        updateRobotEngine(0, 10)
                    },
                    complete: function () {
                        updateRobotEngine(0, 0)
                    }
                })
            .animate({left: "+=" + pileLeft + "px",},
                {
                    duration: DURATION,
                    step: function (now, tween) {
                        updateRobotLocation()
                    },
                    start: function () {
                        updateRobotEngine(10, 0)
                    },
                    complete: function () {
                        updateRobotEngine(0, 0)
                    },
                })
            .animate({top: "+=" + pileTop + "px",},
                {
                    duration: DURATION,
                    step: function (now, tween) {
                        updateRobotLocation()
                    },
                    start: function () {
                        updateRobotEngine(0, -10)
                    },
                    complete: function () {
                        updateRobotEngine(0, 0)
                        updateRobotMagnet(false)
                        robotBlock.className = 'block transparent'
                        lastTransparentBlock.className = 'pile-block ' + color
                        count++
                        counter.innerHTML = count.toString()
                    }
                })
            .animate({top: "-40px",},
                {
                    duration: DURATION,
                    step: function (now, tween) {
                        updateRobotLocation()
                    },
                    start: function () {
                        updateRobotEngine(0, 10)
                    },
                    complete: function () {
                        updateRobotEngine(0, 0)
                    },
                })
            .animate({left: "50%",},
                {
                    duration: DURATION,
                    step: function (now, tween) {
                        updateRobotLocation()
                    },
                    start: function () {
                        updateRobotEngine(-10, 0)
                    },
                    complete: function () {
                        updateRobotEngine(0, 0)
                    },
                })
    } else {
        $("#robot")
            .animate({left: "-DURATIONpx",},
                {
                    duration: DURATION,
                    step: function (now, tween) {
                        updateRobotLocation()
                    }
                })
    }
}

$( document ).ready(function() {
    updateRobotLocation()
    updateRobotEngine()
    updateRobotMagnet()
})