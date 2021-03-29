//client code
// front end

let socket;

let buttonSmall, buttonLarge, buttonNormal;
let circleSize;
let emoji1, emoji2;
let slider;

function preload(){
  emoji1 = loadImage('images/swirl.png');
}

function setup() {
  createCanvas(400, 400);
  background('red');
  socket = io.connect('http://localhost:3000');

  // handle these broadcast calls
  socket.on('mouse', newCircleDrawing);
  socket.on('emoji', newEmojiDrawing)
  buttonSmall = select('#smaller');
  buttonNormal = select('#normal');
  buttonLarge = select('#larger');

  buttonSmall.mousePressed( () => {circleSize = 15} );
  buttonNormal.mousePressed( () => {circleSize = 25} );
  buttonLarge.mousePressed( () => {circleSize = 55} );

  colorMode(HSB); //default rgb
  slider = createSlider(0, 360, 0);
}

function newCircleDrawing(data){
  fill(data.hue, 100, 100);
  ellipse(data.x, data.y, data.size, data.size);
}

function newEmojiDrawing(data){
  image(data.img, data.x, data.y, data.size, data.size);
}
function draw() {
  
}

//will activate whenever you click and drag
function mouseDragged(){
  fill(slider.value(), 100, 100);
  ellipse(mouseX, mouseY, circleSize, circleSize);

  // data is what sockets send to other clients
  let data = {
    x: mouseX,
    y: mouseY,
    size: circleSize,
    hue: slider.value()
  };

  socket.emit('mouse',data);
}

function mouseClicked(){
  image(emoji1, mouseX, mouseY, 50, 50);
  let data = {
    img: emoji1,
    x: mouseX,
    y: mouseY,
    size: circleSize
  };

  socket.emit('emoji', data);
}