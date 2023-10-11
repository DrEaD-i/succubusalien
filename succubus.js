const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7;

class Sprite {
    constructor({position, velocity, color = 'purple', offset }) {
        this.position = position
        this.velocity = velocity
        this.width = 50
        this.height = 150
        this.lastKey
        this.attackBox = {
            position: { 
                x: this.position.x,
                y: this.position.y
            },
            offset,
            width: 100,
            height: 50
        }
        this.color = color
        this.isAttacking
        this.health = 100
    }
    draw() {
        c.fillStyle = this.color
        c.fillRect(this.position.x, this.position.y, this.width, this.height)

        //attackbox
        if (this.isAttacking){
        c.fillStyle = 'getRandomColor'
        c.fillRect(
            this.attackBox.position.x, 
            this.attackBox.position.y, 
            this.attackBox.width, 
            this.attackBox.height
            )
       }
    }
    update() {
        this.draw()
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
         this.velocity.y = 0
        }else this.velocity.y += gravity
    }

    attack() {
        this.isAttacking = true
        setTimeout(() => {
            this.isAttacking = false
        }, 100)
    }
}

const succubus = new Sprite ({
    position: {
     x: 0,
     y: 0
    },
    velocity: {
     x: 0,
     y: 10
    },
    offset: {
        x: 0,
        y: 0
    }
})

const alien = new Sprite ({
    position: {
     x: 400,
     y: 100
    },
    velocity: {
     x: 0,
     y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    }
})

console.log(succubus);

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}

function rectangularCollision({ rectangle1, rectangle2 }) {
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= 
        rectangle2.position.x && rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y && 
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height 
    )
}


function animate () {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    succubus.update()
    alien.update()

    succubus.velocity.x = 0
    alien.velocity.x = 0

        // Check if succubus's health reaches 0
        if (succubus.health <= 0) {
            // Player loses, display a message or take an action
            console.log('Player loses');
            return; // Exit the animation loop
        }
    
        // Check if alien's health reaches 0
        if (alien.health <= 0) {
            // alien loses, display a message or take an action
            console.log('alien loses');
            return; // Exit the animation loop
        }

    // succubus movement
    if (keys.a.pressed && succubus.lastKey === 'a') {
        succubus.velocity.x = -5
    }else if (keys.d.pressed && succubus.lastKey === 'd') {
        succubus.velocity.x = 5
    }
    // alien movement
    if (keys.ArrowLeft.pressed && alien.lastKey === 'ArrowLeft') {
        alien.velocity.x = -5
    }else if (keys.ArrowRight.pressed && alien.lastKey === 'ArrowRight') {
        alien.velocity.x = 5
    }

// detect for collision
if (
rectangularCollision({
    rectangle1: succubus,
    rectangle2: alien
}) &&
succubus.isAttacking
) {
succubus.isAttacking = false
alien.health -= 20
document.querySelector('#alienHealth').style.width = alien.health + '%'
}

if (
    rectangularCollision({
        rectangle1: alien,
        rectangle2: succubus
    }) &&
    alien.isAttacking
    ) {
    alien.isAttacking = false
    succubus.health -= 20
    document.querySelector('#succubusHealth').style.width = succubus.health + '%'
    }
}

animate()

window.addEventListener('keydown', (event) => {

    switch (event.key) {
        case 'd':
         keys.d.pressed = true
         succubus.lastKey = 'd'
         break
        case 'a':
         keys.a.pressed = true
         succubus.lastKey = 'a'
         break
        case 'w':
         succubus.velocity.y = -20
         break
        case ' ':
        succubus.attack()
        break

        case 'ArrowRight':
         keys.ArrowRight.pressed = true
         alien.lastKey = 'ArrowRight'
         break
        case 'ArrowLeft':
         keys.ArrowLeft.pressed = true
         alien.lastKey = 'ArrowLeft'
         break
        case 'ArrowUp':
         alien.velocity.y = -20
         break
        case 'ArrowDown':
         alien.isAttacking = true
         break
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
         keys.d.pressed = false
         break
        case 'a':
         keys.a.pressed = false
         break
    }

    //alien keys
    switch (event.key) {
        case 'ArrowRight':
         keys.ArrowRight.pressed = false
         break
        case 'ArrowLeft':
         keys.ArrowLeft.pressed = false
         break
    }
})

