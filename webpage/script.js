const DURATION = 500

function updateRobotLocation() {
    $('#robot-value-x').text(Math.round($('#robot').offset().left))
    $('#robot-value-y').text(Math.round($('#robot').offset().top))
}

function updateRobotEngine(h, v) {
    if (!h) h = 0
    if (!v) v = 0
    $('#robot-value-motor-h').text(h)
    $('#robot-value-motor-v').text(v)
}

function updateRobotMagnet(v) {
    if (!v) v = false
    if (!v) {
        $('#robot-value-magnet').text('Off').css("background-color", 'transparent')
    } else {
        $('#robot-value-magnet').text('On').css("background-color", '#51EF51FF')
    }
}

function animateKeyframe(isRelative, left, top) {
    if (left != null) {
        if (isRelative) {
            left = "+=" + left + "px"
        } else {
            left = left + "px"
        }
        return {left: left,}
    } else if (top != null) {
        if (isRelative) {
            top = "+=" + top + "px"
        } else {
            top = top + "px"
        }
        return {top: top,}
    }
}

function animateOptions(left, top, options) {
    if (!options) options = {}
    let ans = {
        duration: options.duration || DURATION,
        step: options.step || function (now, tween) {
            updateRobotLocation()
        },
        start: options.start || function () {
            if (left != null)
                updateRobotEngine(left < 0 ? -10 : 10, 0)
            else if (top != null)
                updateRobotEngine(0, top < 0 ? -10 : 10)
        },
        complete: options.complete || function () {
            updateRobotEngine(0, 0)
        },
        progress: options.progress || null,
    }

    return ans
}


function findColor(color) {
    let queue = 'findColor-' + Math.random()
    let bowel = $('.bowel')
    let robot = $('#robot')
    let firstScanLocation = {
        left: bowel.offset().left - robot.offset().left + 1,
        top: bowel.height() - 7
    }
    robot
        .animate(animateKeyframe(true, firstScanLocation.left, null), animateOptions(firstScanLocation.left, null, {queue: queue}))
        .animate(animateKeyframe(true, null, firstScanLocation.top), animateOptions(null, firstScanLocation.top, {queue: queue}))
        .animate(animateKeyframe(true, bowel.width() - 11, null),
            animateOptions(bowel.width() - 11, null, {
                queue: queue,
                duration: DURATION * 5,
                step: function (now, tween) {
                    if (Math.floor($('.block.' + color + ':first').offset().left) === Math.floor(robot.offset().left + 2)) {
                        console.log('found')
                        robot.stop(true)
                    }
                    updateRobotLocation()
                },
                complete: function () {
                    // pickUp(color)
                }
            }))
}

function pickUp(color) {
    updateRobotMagnet(true)
    $('.block.' + color + ':first').className = 'block transparent'
    $('#robot-block').className = 'block ' + color
    goToPile(color)
}

function putDown() {
    updateRobotMagnet(false)
}

function goToPile(color) {
    let pile = $('.pile.' + color + '-b:first')
    let robot = $('#robot')
    let bowel = $('.bowel')
    let counter = $('#' + color + '-counter')
    let lastTransparentBlock = pile.find('.pile-block.transparent:first')
    console.log('here')
    robot
        .animate(animateKeyframe(true, null, -bowel.height() + 7), animateOptions(null, -bowel.height() + 7, {}))
}

function move(color) {
    findColor(color)
}

function move2(color) {
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

$(document).ready(function () {
    updateRobotLocation()
    updateRobotEngine()
    updateRobotMagnet()
})