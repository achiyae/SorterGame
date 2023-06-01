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

function updateRobotSensors() {
    let bowel = $('#bowel')
    let robot = $('#robot')
    let someBowelBlock = $('.block.bowel:first')
    let colorSensor1 = $('#robot-color-1')
    let colorSensor2 = $('#robot-color-2')
    let bowelHeight = Math.floor(bowel.offset().top + bowel.height())
    let robotHeight = Math.floor(robot.offset().top + robot.height() + colorSensor1.height() - 3)
    let robotLeft = Math.floor(robot.offset().left)
    let robotRight = Math.floor(robot.offset().left + robot.width())
    let robotCenter = Math.floor(robot.offset().left + robot.width() / 2)
    let oldColor1 = colorSensor1.attr('class').substring(6);
    let oldColor2 = colorSensor2.attr('class').substring(6);
    let newColor1 = 'transparent'
    let newColor2 = 'transparent'
    if (Math.abs(robotHeight - bowelHeight) <= 2) {
        let e = document.elementsFromPoint(robotCenter, someBowelBlock.offset().top + 2)
            .filter(e => e.className && e.className.includes('block bowel'))
        if (e.length > 0) {
            newColor1 = e[0].className.substring(12)
            newColor2 = e[0].className.substring(12)
        }

    }
    if(oldColor1 !== newColor1)
        colorSensor1.removeClass(oldColor1).addClass(newColor1)
    if(oldColor2 !== newColor2)
        colorSensor2.removeClass(oldColor2).addClass(newColor2)
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
    options.duration = options.duration || DURATION
    options.step = options.step || function (now, tween) {
        updateRobotLocation()
        updateRobotSensors()
    }
    options.start = options.start || function () {
        if (left != null)
            updateRobotEngine(left < 0 ? -10 : 10, 0)
        else if (top != null)
            updateRobotEngine(0, top < 0 ? -10 : 10)
    }
    options.complete = options.complete || function () {
        updateRobotEngine(0, 0)
    }
    return options
}


function hitTheWall(queue) {
    if (queue == null) queue = 'findColor-' + Math.random()
    let robot = $('#robot')
    let locations = []
    for (let i = 0; i < 500; i++) {
        locations.push({left: -30})
        locations.push({left: 30})
    }
    for (let i = 0; i < locations.length; i++) {
        let location = locations[i]
        robot
            .animate(animateKeyframe(true, location.left, null), animateOptions(location.left, null, {queue: queue}))
    }
    robot.dequeue(queue)
}

function findColor(color, queue) {
    if (queue == null) queue = 'findColor-' + Math.random()
    let bowel = $('#bowel')
    let robot = $('#robot')
    let first = $('.block.bowel.' + color + ':first')
    let locations = [
        {left: bowel.offset().left - robot.offset().left + 2},
        {top: bowel.height() - 7},
        {left: bowel.width() - 11}
    ]
    let options = [
        {queue: queue}, {queue: queue}, {
            queue: queue,
            duration: DURATION * 6,
            step: function (now, tween) {
                if (first.length > 0) {
                    let blockLeft = Math.floor(first.offset().left)
                    let robotLeft = Math.floor(robot.offset().left)
                    if (blockLeft >= robotLeft - 2 && blockLeft <= robotLeft + 2) {
                        robot.stop(true)
                    }
                }
                updateRobotLocation()
                updateRobotSensors()
            },
            always: function () {
                updateRobotEngine(0, 0)
                if (first.length > 0)
                    pickUp(color)
                else
                    hitTheWall()
            }
        }
    ]
    for (let i = 0; i < locations.length; i++) {
        let location = locations[i]
        let option = options[i]
        robot
            .animate(animateKeyframe(true, location.left, location.top), animateOptions(location.left, location.top, option))
    }
    robot.dequeue(queue)
}

function pickUp(color) {
    updateRobotMagnet(true)
    $('.block.bowel.' + color + ':first').removeClass(color).removeClass('bowel').addClass('transparent')
    $('#robot-block').removeClass('transparent').addClass(color)
    goToPile(color)
}

function goToBowel(pileBlock, queue) {
    if (queue == null) queue = 'findColor-' + Math.random()
    let location = {
        top: $('#bowel').offset().top - $('#robot').offset().top - 40,
        left: -($('#robot').offset().left - $('#bowel').offset().left - $('#bowel').width() / 2)
    }
    let robot = $('#robot')
    robot
        .animate(animateKeyframe(true, null, location.top), animateOptions(null, location.top, {queue: queue}))
        .animate(animateKeyframe(true, location.left, null), animateOptions(location.left, null, {queue: queue}))
    robot.dequeue(queue)
}

function putDown(pileBlock, color) {
    updateRobotMagnet(false)
    pileBlock.removeClass('transparent').addClass(color)
    $('#robot-block').removeClass(color).addClass('transparent')
    let counter = parseInt($('#' + color + '-counter').text())
    $('#' + color + '-counter').text(counter + 1)
    goToBowel(pileBlock)
}

function goToPile(color, queue) {
    if (queue == null) queue = 'findColor-' + Math.random()
    let pile = $('.pile.' + color + '-b:first')
    let robot = $('#robot')
    let bowel = $('#bowel')
    let counter = parseInt($('#' + color + '-counter').text())
    let lastTransparentBlock = pile.find('.pile-block.transparent:first')
    let pileLocations = [
        {top: -bowel.height() + 7},
        {left: pile.offset().left - robot.offset().left + 5},
        {top: lastTransparentBlock.offset().top - robot.offset().top + robot.height() + 2}]
    let options = [
        {queue: queue}, {queue: queue}, {queue: queue, always: () => putDown(lastTransparentBlock, color)}]
    for (let i = 0; i < pileLocations.length; i++) {
        let location = pileLocations[i]
        robot.animate(animateKeyframe(true, location.left, location.top), animateOptions(location.left, location.top, options[i]))
    }
    robot.dequeue(queue)
}

function move(color) {
    findColor(color)
}

$(document).ready(function () {
    updateRobotLocation()
    updateRobotEngine()
    updateRobotMagnet()
})