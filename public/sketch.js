//client code
// front end

let socket;
let drawingMode = 'stroke';
let circleSize;
// let emoji1, emoji2;

//-------------------------------------------------------------------------------------------------
//Boolean for detecting if mouse is on canvas
let mouseOverCanvas;

//Button Selectors and Listeners for drawing style

styleBtns = document.getElementsByClassName('drawingStyle');
for (let index = 0; index < styleBtns.length; index++) {
  styleBtns[index].addEventListener("click", function(){
    let currBtn = document.getElementsByClassName('active');
    currBtn[0].classList.remove('active');
    this.classList.add('active');
  })
  
}

//Size Slider Selectors for size and color values
let strokeSizeSlider = document.querySelector("#strokeSizeSlider");
let strokeSizeValue = document.querySelector("#strokeSizeValue");
let circleSizeSlider = document.querySelector("#circleSizeSlider");
let circleSizeValue = document.querySelector("#circleSizeValue");

//Updates html with current selected slider values
strokeSizeValue.innerHTML = strokeSizeSlider.value;
strokeSizeSlider.oninput = function(){strokeSizeValue.innerHTML = this.value};
circleSizeValue.innerHTML = circleSizeSlider.value;
circleSizeSlider.oninput = function(){circleSizeValue.innerHTML = this.value};

//Color Slider Selectors and Values
let colorSlider = document.querySelector('#colorSlider');
let colorValue = document.querySelector('#colorValue');
let colorPreview = document.querySelector('#colorPreview');
let r,g,b;
colorValue.innerHTML = colorSlider.value;
[r,g,b] = HSBToRGB(colorSlider.value, 100, 100);
colorPreview.style.color = `rgb(${r},${g},${b})`;
colorSlider.oninput = function(){
  colorValue.innerHTML = this.value;
  [r,g,b] = HSBToRGB(this.value, 100, 100);
  colorPreview.style.color = `rgb(${r},${g},${b})`;
};


//----------------------------------------------------------------------------------------------
// function preload(){
//   emoji1 = loadImage('images/swirl.png');
// }

function setup() {
  cnv = createCanvas(750, 750);
  cnv.parent('canvasBox');
  cnv.mouseOver(() => mouseOverCanvas = true );
  cnv.mouseOut(() => mouseOverCanvas = false);
  background('black');
  //'https://idm-collaborative-drawing.herokuapp.com/'
  socket = io.connect('https://idm-collaborative-drawing.herokuapp.com/');

  // handle these broadcast calls
  socket.on('draw', newDrawing);
  socket.on('clear', () => {
    background('black');
  })

  buttonStroke = select('#strokeStyle');
  buttonCircle = select('#circleStyle');
  buttonClear = select('#clear');
  buttonEraser = select('#eraser');

  buttonStroke.mousePressed( () => {
    drawingMode = "stroke";
  });

  buttonCircle.mousePressed( () => {
    drawingMode = 'circle';
  })

  buttonClear.mousePressed( () => {
    background('black');

    socket.emit('clear');
  })

  buttonEraser.mousePressed( () => {
    drawingMode = 'eraser';
  })
  colorMode(HSB); //default rgb
}

function newDrawing(data){
  if (data.mode == 'stroke'){
    stroke(data.hue, 100, 100);
    strokeWeight(data.strokeSize);
    line(data.x, data.y, data.px, data.py);
  }
  else if (data.mode == 'circle'){
    stroke('white');
    fill(data.hue, 100, 100);
    ellipse(data.x, data.y, data.size, data.size);
  }
  else if (data.mode == 'eraser'){
    stroke('black');
    strokeWeight(data.strokeSize);
    line(data.x, data.y, data.px, data.py);
  }
}


// function newEmojiDrawing(data){
//   image(data.img, data.x, data.y, data.size, data.size);
// }
function draw() {
  
}

//will activate whenever you click and drag
function mouseDragged(){
  if (mouseOverCanvas){
    console.log('on Canvas');
    let data;
    if (drawingMode == "stroke"){
      stroke(colorSlider.value, 100, 100);
      console.log(colorSlider.value);
      strokeWeight(strokeSizeSlider.value);
      line(mouseX, mouseY, pmouseX, pmouseY);
      data = {
        mode: drawingMode,
        x: mouseX,
        y: mouseY,
        px: pmouseX,
        py: pmouseY,
        strokeSize: strokeSizeSlider.value,
        hue: colorSlider.value
      };
    }
    else if(drawingMode == "circle") {
      stroke('white');
      fill(colorSlider.value, 100, 100);
      ellipse(mouseX, mouseY, circleSizeSlider.value, circleSizeSlider.value);
      data = {
        mode: drawingMode,
        x: mouseX,
        y: mouseY,
        size: circleSizeSlider.value,
        hue: colorSlider.value
      };
    }

    else if(drawingMode == 'eraser'){
      stroke('black');
      strokeWeight(strokeSizeSlider.value);
      line(mouseX, mouseY, pmouseX, pmouseY);
      data = {
        mode: drawingMode,
        x: mouseX,
        y: mouseY,
        px: pmouseX,
        py: pmouseY,
        strokeSize: strokeSizeSlider.value,
      };
    }

    // data is what sockets send to other clients
    socket.emit('draw',data);
  }
  else {
    console.log('NOT on canvas');
  }
}

//helper function to translate hsb to rgb
//https://www.30secondsofcode.org/js/s/hsb-to-rgb
function HSBToRGB(h, s, b) {
  s /= 100;
  b /= 100;
  const k = (n) => (n + h / 60) % 6;
  const f = (n) => b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
  return [255 * f(5), 255 * f(3), 255 * f(1)];
};