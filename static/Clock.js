var canvas = document.getElementById("newClock");
var ctx  = canvas.getContext("2d");
var radius = canvas.height/2;
ctx.translate(radius, radius);  // set(0,0) co-od to the center of circle
radius *= 0.90;
setInterval(drawClock, 1000);
function drawClock() {
    drawFace();
    drawNumbers();
    drawTime();
}

function drawFace() {
    //Fill blue in the middle
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2*Math.PI);
    ctx.fillStyle = '#0066ff';
    ctx.fill();
    // Draw the outer ring
    var grad = ctx.createRadialGradient(0, 0, radius*0.95, 0, 0, radius*1.05);
    grad.addColorStop(0, '#ff6600');
    grad.addColorStop(0.5, '#66ff66');
    grad.addColorStop(1, '#ff6600');
    ctx.strokeStyle = grad;
    ctx.lineWidth = radius*0.05;
    ctx.stroke();
}

function drawNumbers(){
    var ang;
    var num;
    //number drawing algorithm
    ctx.font = radius*0.15 + "px impact";
    ctx.textBaseline= "middle";
    ctx.textAlign="center";
    ctx.fillStyle = 'black';
    for (num = 1; num < 13; ++num)
    {
        ang = num * Math.PI/6;
        ctx.rotate(ang);
        ctx.translate(0, -radius*0.85);
        ctx.rotate(-ang);
        ctx.fillText(num.toString(), 0, 0);
        ctx.rotate(ang);
        ctx.translate(0, radius*0.85);
        ctx.rotate(-ang);
    }
}

function drawTime() {
    var time = new Date();
    var hour = time.getHours();
    var min  = time.getMinutes();
    var sec  = time.getSeconds();
    // change hour, min, sec to suitable angle
    hour %= 12;
    hour = ( hour*Math.PI/6 ) + ( min*Math.PI/(60*6) ) + ( sec*Math.PI/(360*6) );
    min  = ( min*Math.PI/30 ) + ( sec*Math.PI/30*60 );
    sec  = ( sec*Math.PI/30 );
    drawHand( hour, radius*0.5, radius*0.05, 'red');
    drawHand( min , radius*0.7, radius*0.03, 'yellow');
    drawHand( sec , radius*0.9, radius*0.02, 'white');
    // Draw the center
    ctx.beginPath()
    ctx.arc(0,0, radius*0.05, 0, 2*Math.PI);
    ctx.fillStyle = 'black';
    ctx.fill();
}

function drawHand( pos, len, wid, color )  {
    //property of the hands
    ctx.beginPath();
    ctx.lineWidth = wid;
    ctx.lineCap = "round";
    ctx.strokeStyle = color;
    //handling the pointer and draw
    ctx.moveTo(0,0);
    ctx.rotate(pos);
    ctx.lineTo(0,-len);
    ctx.stroke();
    ctx.rotate(-pos);
}