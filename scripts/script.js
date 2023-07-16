const canv = document.querySelector('#canvas')
const ctx = canv.getContext('2d')

canv.width = window.innerWidth
canv.height = window.innerHeight

const wallLeft = { x: 0, y: 0, width: 50, height: canv.height, type: 'square' }
const wallRight = { x: canv.width - 50, y: 0, width: 50, height: canv.height, type: 'square' }
const wallTop = { x: 0, y: 0, width: canv.width, height: 50, type: 'square' }
const wallBottom = { x: 0, y: canv.height - 50, width: canv.width, height: 50, type: 'square' }
const squares = [
    { x: 100, y: 300, width: 100, height: 100, type: 'square' },
    { x: 1000, y: 500, width: 100, height: 100, type: 'square' },
    { x: 500, y: 700, width: 100, height: 100, type: 'square' },]
const player = { x: 200, y: 200, type: 'path', rotation: 0, path: [0, -15, -15, 15, 15, 15, 0, -15], player: true }


const scene = [wallLeft, wallRight, wallTop, wallBottom, ...squares, player]


let isMoving = false
let currentKey = null

const speed = 3

let dx = 0
let dy = 0

const fov = 500

function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y > rect2.y
}

function allColisions(elem) {
    for (let i = 0; i < scene.length; i++) {
        
        if (scene[i] !== elem) {

            if (checkCollision(elem, scene[i])) {
                return true
            }

        }

    }
    return false
}

document.onkeydown = (e) => {
    if (e.code === 'KeyW' || e.code === 'KeyA' || e.code === 'KeyS' || e.code === 'KeyD') {
        isMoving = true
        currentKey = e.code
    }
}

document.onkeyup = (e) => {
    if (e.code === 'KeyW' || e.code === 'KeyA' || e.code === 'KeyS' || e.code === 'KeyD') {
        isMoving = false
        currentKey = null
    }
}

function goFront() {
    dx = Math.sin(player.rotation * Math.PI / 180) * speed
    dy = -Math.cos(player.rotation * Math.PI / 180) * speed
    slide(dx, 0)
    slide(0, dy)
}

function goBack() {
    dx = -Math.sin(player.rotation * Math.PI / 180) * speed
    dy = Math.cos(player.rotation * Math.PI / 180) * speed
    slide(dx, 0)
    slide(0, dy)
}

function movePlayer() {
    if (isMoving && currentKey !== null) {
        if (currentKey === "KeyW") {
            goFront()
        } else if (currentKey === "KeyA") {
            player.rotation -= 2
        } else if (currentKey === "KeyS") {
            goBack()
        } else if (currentKey === "KeyD") {
            player.rotation += 2
        }
    }
}

function slide(dx, dy) {
    player.x += dx
    player.y += dy
    if (allColisions(player)) {
        player.x -= dx
        player.y -= dy
    }
}


function oneRay(angle) {
    const stepX = 10 * Math.sin((player.rotation + angle / 5) * Math.PI / 180)
    const stepY = 10 * -Math.cos((player.rotation + angle / 5)* Math.PI / 180)
    let length = 0

    for(let i = 0; !allColisions({x: player.x + stepX * i, y: player.y + stepY * i}) && i < 300; i += 0.25) {
        length++
    }
    if(angle === 0) {
        console.log(length)
    }
    drawWall(canv.width / fov * angle, 20000 / length)
}

function drawWall(x, height) {
    let brightness = height / 2
    if (brightness > 255) brightness = 255
    else if (brightness < 0) brightness = 0

    ctx.beginPath()
    ctx.strokeStyle = `rgb(${brightness}, ${brightness}, ${brightness})`
    ctx.lineWidth = 1
    ctx.moveTo(canv.width / 2 + x, canv.height / 2)
    ctx.lineTo(canv.width / 2 + x, canv.height / 2 - height)
    ctx.lineTo(canv.width / 2 + x, canv.height / 2 + height)
    ctx.stroke()
}

function rayMarch(fov) {
    ctx.clearRect(0, 0, canv.width, canv.height)
    ctx.fillStyle = 'black' 
    ctx.fillRect(0, 0, canv.width, canv.height)
    for(let i = 0; i < fov; i++) {
        oneRay(i - fov / 2)
    }
}


function Frame() {
    movePlayer()
    rayMarch(fov)

    requestAnimationFrame(Frame)
}

Frame()