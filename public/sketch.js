//client code
// front end

let socket;
let drawingMode = 'stroke';
let buttonStroke;
let buttonCircle;
let buttonClear;
let buttonEraser;
let colorPicker;
// let emojiPicker;

//emojis

// let emojiNames = ['fear', 'heartEyes', 'snore', 'sunglasses', 'swirl', 'tears', 'unamused', 'wink'];
// let emojiImages = {};
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

//Emojis
// emojiSection = document.querySelector("#emojiBox")
// emojiNames.forEach(emoji => {
//   let element = document.createElement('div');
//   element.classList.add('emoji');
//   element.style.backgroundImage = `url(./images/${emoji}.png)`;
//   emojiSection.appendChild(element);

// });


//----------------------------------------------------------------------------------------------
// function preload(){
//   for (let i = 0; i < emojiNames.length; i++) {
//     let emoji = loadImage(`images/${emojiNames[i]}.png`);
//     emojiImages[i] = emoji;
//   }
//   //emoji1 = loadImage('images/swirl.png');
// }

function setup() {
  cnv = createCanvas(windowWidth, windowHeight);
  cnv.parent('canvasBox');
  cnv.mouseOver(() => mouseOverCanvas = true );
  cnv.mouseOut(() => mouseOverCanvas = false);
  background('black');
  //'https://idm-collaborative-drawing.herokuapp.com/'
  socket = io.connect('http://localhost:3000');

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

  colorPicker = select('#colorPicker');
  // for (let i = 0; i < emojiNames.length; i++) {
  //   emojiPicker.option(emojiNames[i], i);
  // }
}

function newDrawing(data){
  if (data.mode == 'stroke'){
    stroke(data.color);
    strokeWeight(data.strokeSize);
    line(data.x, data.y, data.px, data.py);
  }
  else if (data.mode == 'circle'){
    stroke('white');
    strokeWeight(1);
    fill(data.color);
    ellipse(data.x, data.y, data.size, data.size);
  }
  else if (data.mode == 'eraser'){
    stroke('black');
    strokeWeight(data.strokeSize);
    line(data.x, data.y, data.px, data.py);
  }
  // else if (data.mode == 'emoji'){
  //   imageMode(CENTER);
  //   image(emojiImages[data.value], data.x, data.y, data.size, data.size);
  // }
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
      stroke(colorPicker.value());
      strokeWeight(strokeSizeSlider.value);
      line(mouseX, mouseY, pmouseX, pmouseY);
      data = {
        mode: drawingMode,
        x: mouseX,
        y: mouseY,
        px: pmouseX,
        py: pmouseY,
        strokeSize: strokeSizeSlider.value,
        color: colorPicker.value()
      };
    }
    else if(drawingMode == "circle") {
      stroke('white');
      strokeWeight(1);
      fill(colorPicker.value());
      ellipse(mouseX, mouseY, circleSizeSlider.value, circleSizeSlider.value);
      data = {
        mode: drawingMode,
        x: mouseX,
        y: mouseY,
        size: circleSizeSlider.value,
        color: colorPicker.value()
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
    else{
      return;
    }

    // data is what sockets send to other clients
    socket.emit('draw',data);
  }
  else {
    console.log('NOT on canvas');
  }
}

function mouseClicked() {
  if (drawingMode == 'emoji'){
    imageMode(CENTER);
    image(emojiImages[emojiPicker.value()], mouseX, mouseY, circleSizeSlider.value, circelSizeSlider.value);
  }
  else {
    return;
  }
  let data = {
    x: mouseX,
    y: mouseY,
    size : circleSizeSlider.value,
    value: emojiPicker.value()
  }
  socket.emit('emoji', data);
}