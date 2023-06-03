const DURATION = 500
const RED = 'rgb(255, 0, 0)'
const GREEN = 'rgb(0, 255, 0)'
const BLUE = 'rgb(0, 0, 255)'
const TRANSPARENT = 'rgba(0, 0, 0, 0)'
let sensorsError = 'always-green'
let enableSensorErrors = false
let magnetErrors = false
let findColorMalfunctionCode = 0

function addNoiseToRGB(rgb, noiseRange = 100) {
    if (rgb === 'red') {
        rgb = RED
    } else if (rgb === 'green') {
        rgb = GREEN
    } else if (rgb === 'blue') {
        rgb = BLUE
    } else {
        throw new Error('Unknown color: ' + rgb)
    }
    // Parse the RGB value into separate color channels
    let channels = rgb.match(/\d+/g);
    let red = parseInt(channels[0]);
    let green = parseInt(channels[1]);
    let blue = parseInt(channels[2]);

    // Generate random noise for each color channel
    let redNoise = Math.floor(Math.random() * noiseRange) + 20
    let greenNoise = Math.floor(Math.random() * noiseRange) + 20
    let blueNoise = Math.floor(Math.random() * noiseRange) + 20

    // Add the noise to the original RGB values
    red = red === 0 ? red + redNoise : red - redNoise;
    green = green === 0 ? green + greenNoise : green - greenNoise;
    blue = blue === 0 ? blue + blueNoise : blue - blueNoise;

    // Create the modified RGB value with noise
    rgb = `rgb(${red}, ${green}, ${blue})`
    return rgb
}


function updateSensorsEquipment(val) {
    sensorsError = val
    findColorMalfunctionCode = 0
}

function toggleSensorErrors(checkbox) {
    let radioButtons = document.getElementsByName("color-sensor");
    for (let i = 0; i < radioButtons.length; i++) {
        radioButtons[i].disabled = !checkbox.checked;
    }
    enableSensorErrors = checkbox.checked
}

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
    if (v == null) {
        if (magnetErrors && $('#robot-value-magnet').text() === 'On') {
            if (Math.random() < 0.01) {
                // console.log('Magnet error')
                $('#robot-value-magnet').text('Off').css("background-color", 'transparent')
                setTimeout(() => {
                    if ($('#robot-block').css("background-color") !== TRANSPARENT) {
                        $('#robot-value-magnet').text('On').css("background-color", '#51EF51FF')
                    }
                }, 100)
            }
        }
        return
    }
    if (!v) {
        $('#robot-value-magnet').text('Off').css("background-color", 'transparent')
    } else {
        $('#robot-value-magnet').text('On').css("background-color", '#51EF51FF')
    }
}

function findColorMalfunction(baseQueue, robot, color) {
    let queue = baseQueue + 'findColorMalfunction'
    let oldQueue = baseQueue + 'findColor'
    let secondBowelBlock = $('.block.bowel:not(.transparent)').eq(1)
    robot.stop(true)
    // console.log('secondBowelBlock', secondBowelBlock)
    let offset = secondBowelBlock.offset().left - robot.offset().left
    robot.animate(
        animateKeyframe(true, offset, null),
        animateOptions(offset, null, {queue: queue}))
    robot.animate(
        animateKeyframe(true, -offset, null),
        animateOptions(-offset, null, {
            queue: queue, complete: () => {
                updateRobotEngine(0, 0)
                robot.dequeue(oldQueue)
            },
            complete: () => {
                findColorMalfunctionCode = 2 // 2 - success
                findColor(baseQueue, color, true)
            }
        }))
    robot.dequeue(queue)
}

function updateRobotSensors() {
    let bowel = $('#bowel')
    let robot = $('#robot')
    let someBowelBlock = $('.block.bowel:first')
    let colorSensor1 = $('#robot-color-1')
    let colorSensor2 = $('#robot-color-2')
    let bowelHeight = Math.floor(bowel.offset().top + bowel.height())
    let robotHeight = Math.floor(robot.offset().top + robot.height() + colorSensor1.height() - 3)
    let robotCenter = Math.floor(robot.offset().left + robot.width() / 2)
    let oldColor1 = colorSensor1.attr('class').substring(6);
    let oldColor2 = colorSensor2.attr('class').substring(6);
    let newColor1 = 'transparent'
    let newColor2 = 'transparent'
    if (Math.abs(robotHeight - bowelHeight) <= 2) {
        let bowelBlocks = document.elementsFromPoint(robotCenter, someBowelBlock.offset().top + 2)
            .filter(e => e.className && e.className.includes('block bowel'))
        if (bowelBlocks.length > 0) {
            newColor1 = bowelBlocks[0].className.substring(12)
            newColor2 = bowelBlocks[0].className.substring(12)
        }
    }
    let robotBlock = $('#robot-block')
    if (robotBlock.css("background-color") !== 'rgba(0, 0, 0, 0)') {
        newColor1 = robotBlock.attr('class').substring(6)
        newColor2 = robotBlock.attr('class').substring(6)
    }
    if (enableSensorErrors && sensorsError === 'always-green' && newColor1 !== 'transparent') {
        newColor1 = 'green'
        if (findColorMalfunctionCode === 0) {
            findColorMalfunctionCode = 1
        }
    }
    if (enableSensorErrors && sensorsError === 'noise') {
        if (newColor1 !== 'transparent') {
            colorSensor1.css("background-color", addNoiseToRGB(newColor1))
            colorSensor2.css("background-color", addNoiseToRGB(newColor2))
        } else {
            colorSensor1.css("background-color", '')
            colorSensor2.css("background-color", '')
        }
        if (findColorMalfunctionCode === 0) {
            findColorMalfunctionCode = 1
        }
    }
    if (oldColor1 != newColor1) {
        colorSensor1.removeClass(oldColor1).addClass(newColor1)
    }
    if (oldColor2 != newColor2) {
        colorSensor2.removeClass(oldColor2).addClass(newColor2)
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
    options.duration = options.duration || DURATION
    options.step = options.step || function (now, tween) {
        updateRobotLocation()
        updateRobotSensors()
        updateRobotMagnet()
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


function hitTheWall(baseQueue) {
    let queue = baseQueue + 'findColor'
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

function findColor(baseQueue, color, startFromBowel) {
    let queue = baseQueue + 'findColor'
    let bowel = $('#bowel')
    let robot = $('#robot')
    let first = $('.block.bowel.' + color + ':first')
    let locations = [
        {left: bowel.offset().left - robot.offset().left + 2},
        {top: bowel.height() - 7},
        {left: bowel.width() - 11}
    ]
    let options = [
        {queue: queue},
        {queue: queue},
        {
            queue: queue,
            duration: DURATION * 6,
            step: function (now, tween) {
                updateRobotLocation()
                updateRobotSensors()
                if (findColorMalfunctionCode === 1) {
                    findColorMalfunction(baseQueue, robot, color)
                }
                if (first.length > 0) {
                    let robotCenter = Math.floor(robot.offset().left + robot.width() / 2)
                    let blockCenter = Math.floor(first.offset().left + first.width() / 2)
                    if (Math.abs(robotCenter - blockCenter) <= 2) {
                        robot.stop(true)
                    }
                }
            },
            always: function () {
                updateRobotEngine(0, 0)
                if (findColorMalfunctionCode !== 1) {
                    if (first.length > 0)
                        pickUp(baseQueue, color)
                    else
                        hitTheWall(baseQueue)
                }
            }
        }
    ]
    if (startFromBowel) {
        locations.splice(0,2)
        options.splice(0,2)
    }
    for (let i = 0; i < locations.length; i++) {
        let location = locations[i]
        let option = options[i]
        robot
            .animate(animateKeyframe(true, location.left, location.top), animateOptions(location.left, location.top, option))
    }
    robot.dequeue(queue)
}

function pickUp(baseQueue, color) {
    updateRobotMagnet(true)
    $('.block.bowel.' + color + ':first').removeClass(color).removeClass('bowel').addClass('transparent')
    $('#robot-block').removeClass('transparent').addClass(color)

    goToPile(baseQueue, color)
}

function putDown(baseQueue, pileBlock, color) {
    updateRobotMagnet(false)
    pileBlock.removeClass('transparent').addClass(color)
    $('#robot-block').removeClass(color).addClass('transparent')
    let counter = parseInt($('#' + color + '-counter').text())
    $('#' + color + '-counter').text(counter + 1)

    goToBowel(baseQueue)
}

function goToBowel(baseQueue) {
    let queue = baseQueue + 'findColor'
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

function goToPile(baseQueue, color) {
    let queue = baseQueue + 'findColor'
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
        {queue: queue}, {queue: queue}, {
            queue: queue,
            always: () => putDown(baseQueue, lastTransparentBlock, color)
        }]
    for (let i = 0; i < pileLocations.length; i++) {
        let location = pileLocations[i]
        robot.animate(animateKeyframe(true, location.left, location.top), animateOptions(location.left, location.top, options[i]))
    }
    robot.dequeue(queue)
}

function move(color) {
    findColor(Math.random() + '-', color)
}

$(document).ready(function () {
    updateRobotLocation()
    updateRobotEngine(0, 0)
    updateRobotMagnet(false)
})