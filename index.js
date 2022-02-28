// Element
const canvas = document.querySelector('canvas');
let characterCtx = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;


let scoreEle = document.getElementById('score');
let startGameBtn = document.getElementById('startGameBtn')
let model = document.getElementById('model')
let finalScore = document.getElementById('finalScore')



//Creat Random color (for both player and enemy)
function getRandomHex() {
    return Math.floor(Math.random() * 255);
}
function getRandomColors() {
    let red = getRandomHex();
    let green = getRandomHex();
    let blue = getRandomHex();
    return `RGB(${red},${blue},${green})`;
}

// Player info
class Player {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }

    draw() {
        characterCtx.beginPath();
        characterCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        characterCtx.fillStyle = this.color;
        characterCtx.fill();
    }
}

// 
// Player position
let x = canvas.width / 2;
let y = canvas.height / 2;
let color = getRandomColors()

//Khai báo Game element
let player = new Player(x, y, 20, color);
let projectiles = [];
let enemies = [];

//Start button
function start() {
    player = new Player(x, y, 20, color);
    projectiles = [];
    enemies = [];
    score=0;
    scoreEle.innerHTML=score;
    finalScore.innerHTML=score;
}



//Create and shootProjectile
class Projectile {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw() {
        characterCtx.beginPath();
        characterCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        characterCtx.fillStyle = this.color;
        characterCtx.fill();
    }

    update() {
        this.draw()
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
}



// Create Enemies
class Enemy {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw() {
        characterCtx.beginPath();
        characterCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        characterCtx.fillStyle = this.color;
        characterCtx.fill();
    }

    update() {
        this.draw()
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
}



function spawnEnemies() {
    setInterval(() => {
        let radius = Math.random() * (30 - 10) + 10;
        let x;
        let y;
        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
            y = Math.random() * canvas.height;
        } else {
            x = Math.random() * canvas.width;
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
        }

        let color = getRandomColors();
        let angle = Math.atan2(
            canvas.height / 2 - y,
            canvas.width / 2 - x
        )
        // console.log(angle);

        let velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }
        enemies.push(new Enemy(x, y, radius, color, velocity));
        console.log(enemies)
    }, 1000)
}


// Animation
let animateId;
let score = 0;
function animate() {
    animateId = requestAnimationFrame(animate);
    characterCtx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    characterCtx.fillRect(0, 0, canvas.width, canvas.height);
    player.draw()
    // projectile.draw();
    // projectile.update();
    projectiles.forEach((projectile, index) => {
        projectile.update()

        // remove projectiles from edges of the screen
        if (projectile.x + projectile.radius < 0 ||
            projectile.x - projectile.radius > canvas.width ||
            projectile.y + projectile.radius < 0 ||
            projectile.y - projectile.radius > canvas.height) {
            setTimeout(() => {
                projectiles.splice(index, 1)
            }, 0);
        }
    })

    enemies.forEach((enemy, index) => {
        enemy.update();

        let dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);

        //endgame
        if (dist - enemy.radius - player.radius < 0.5) {
            // console.log('endgame')
            cancelAnimationFrame(animateId);
            model.style.display = 'flex';
            finalScore.innerHTML = score;
        }


        projectiles.forEach((projectile, projectilesIndex) => {
            let dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
            // console.log(dist);
            // increase the score:


            // when projectiles touch enemy and point counter
            if (dist - enemy.radius - projectile.radius < 0.5) {
                // console.log('remove from screen');
                if (enemy.radius - 10 > 10) {
                    score += 100;
                    scoreEle.innerHTML = score;
                    setTimeout(() => {
                        projectiles.splice(projectilesIndex, 1)
                    }, 0);
                    enemy.radius -= 10;
                } else {
                    score += 250;
                    scoreEle.innerHTML = score;
                    setTimeout(() => {
                        enemies.splice(index, 1)
                        projectiles.splice(projectilesIndex, 1)
                    }, 0);
                }
            }
        })
    })

}

window.addEventListener('click', (event) => {
    console.log(projectiles)
    let angle = Math.atan2(
        event.clientY - canvas.height / 2,
        event.clientX - canvas.width / 2
    )
    // console.log(angle);

    let velocity = {
        x: Math.cos(angle) * 5,
        y: Math.sin(angle) * 5
    }
    projectiles.push(new Projectile(
        canvas.width / 2, canvas.height / 2,
        5, 'red', velocity
    ))
})

startGameBtn.addEventListener('click', () => {
    start();
    animate();
    spawnEnemies();
    model.style.display = 'none'
})

