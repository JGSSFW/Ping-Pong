const canvasEl = document.querySelector('canvas'), 
canvasCtx = canvasEl.getContext('2d'),
lineWidth = 15,
gapX = 10,
mouse = {x: 0, y: 0},
field = {
    w: window.innerWidth,
    h: window.innerHeight,
    draw: function(){
        canvasCtx.fillStyle = '#286047'
        canvasCtx.fillRect(0, 0, this.w, this.h)
    }
},
line = {
    w: 15,
    h:field.h,
    draw: function(){
        canvasCtx.fillStyle = '#FFF'
        canvasCtx.fillRect(field.w / 2 - this.w / 2, 0, this.w, this.h)
    }
},
lPaddle = {
    x: gapX,
    y: 100,
    w:line.w,
    h:200,
    _move: function(){
        this.y = mouse.y - this.h / 2
    },
    draw: function(){
        canvasCtx.fillStyle = '#FFF'
        canvasCtx.fillRect(this.x, this.y, this.w, this.h)

        this._move()
    }
},
rPaddle = {
    x: field.w - line.w - gapX,
    y: 0,
    w: line.w,
    h:200,
    directionY: 1,
    speed: 3,
    _move: function(){
        this.y+=this.directionY * this.speed
        if(this.y  > field.h - this.h || this.y < 0){
            this._reverseY()
        }
    },
    _speedUp: function(){
        this.speed += 4
    },
    _reverseY: function(){
        this.directionY *= -1
    },
    draw: function(){
        canvasCtx.fillStyle = '#FFF'
        canvasCtx.fillRect(this.x, this.y, this.w, this.h)
        this._move()
    }
},
score = {
    human: 0,
    computer: 0,
    _increaseHuman: function(){
        if(score.human == 9){
            window.location.href = 'uwin.html';
        }else{
            this.human ++
        }
    },
    _increaseComputer: function(){
        if(score.computer == 9){
            window.location.href = 'ulose.html';
        }else{
            this.computer++
        }
    },
    draw: function(){
        canvasCtx.font = 'bold 60px Arial'
        canvasCtx.textAlign = 'center'
        canvasCtx.textBaseline = 'top'
        canvasCtx.fillStyle = '#01341D'
        canvasCtx.fillText(this.human, field.w / 4, 20)
        canvasCtx.fillText(this.computer, field.w / 4 + field.w / 2, 20)
    }
},
ball ={
    x: 50,
    y: 0,
    r: 20,
    speed: 5,
    directionX: 1,
    directionY: 1,
    _calcPosition: function(){
        //computer paddle hit or player point verification
        if(this.x > field.w - this.r - rPaddle.w - gapX){
            if(this.y + this.r > rPaddle.y && this.y - this.r < rPaddle.y + rPaddle.h) {
                this._reverseX()
            }else{
                score._increaseHuman()
                this._pointUp()
            }
        }

        //player paddle hit or computer point verification
        if(this.x < this.r + lPaddle.w + gapX){
            if(this.y + this.r > lPaddle.y && this.y - this.r < lPaddle.y + lPaddle.h){
                this._reverseX()
            }else{
                score._increaseComputer()
                this._pointUp()
            }

        }

        //ball edge hit verification
        if(
            (this.y - this.r < 0 && this.directionY<0) ||
            (this.y > field.h - this.r && this.directionY > 0)
        ) {
            this._reverseY()
        }
    },
    _reverseX: function(){
        this.directionX *= -1
    },
    _reverseY: function(){
        this.directionY *= -1
    },
    _speedUp: function(){
        this.speed += 2
    },
    _paddleReduce: function(){
        rPaddle.h -= 10
        lPaddle.h -= 10
    },
    _pointUp: function(){
        this.x = field.w / 2
        this.y = field.h / 2
        this._speedUp()
        rPaddle._speedUp()
        this._paddleReduce()
    },
    _move: function(){
        this.x += this.directionX * this.speed
        this.y += this.directionY * this.speed
    },
    draw: function(){
        canvasCtx.fillStyle = '#FFF'
        canvasCtx.beginPath()
        canvasCtx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false)
        canvasCtx.fill()

        this._calcPosition()
        this._move()
        console.log(this.speed)
    }
}

//set the field size
function setup(){
    canvasEl.width = canvasCtx.width = field.w
    canvasEl.height = canvasCtx.height = field.h
}

//draw game elements
function draw(){

    field.draw()
    line.draw()

    lPaddle.draw()
    rPaddle.draw()
    
    score.draw()

    ball.draw()
}

window.animateFrame = (function() {
    return(
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) {
            return window.setTimeout(callback, 1000 / 60)
        }
    )
})()

function main(){
    animateFrame(main)
    draw()
}

setup()
main()


canvasEl.addEventListener('mousemove', function(e){
    mouse.x = e.pageX
    mouse.y = e.pageY
})