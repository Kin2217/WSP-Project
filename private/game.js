let selectedColor = 'black' // define the user selected color
let selectedStrokeWeight = 10
const socket = io.connect(); // connect to socketIO

function changeColor(color) {
  selectedColor = color;
  // console.log("selectedColor: " + selectedColor)
  // socket.emit("new-color", { selectedColor }) // 傳送selectedColor給server
}
function changeStroke(number) {
  selectedStrokeWeight = number
}
function clearBoard() {
  background(255)
  socket.emit("clear-board") //tell server to clear drawing board
}

socket.on("clear", data => { //clear drawing board as per sever
  background(255)
})

//接收server送來的座標
socket.on("draw-new-line", ({ mouseX, mouseY, pmouseX, pmouseY, selectedColor, selectedStrokeWeight }) => {
  // noStroke()
  // fill(selectedColor)
  // ellipse(mouseX, mouseY, 5)
  strokeWeight(selectedStrokeWeight)
  stroke(selectedColor)
  line(mouseX, mouseY, pmouseX, pmouseY)
})
function setup() {
  const myCanvas = createCanvas(1400, 640); // 遊戲版 Width x Height
  myCanvas.parent(document.querySelector("#drawing-board"))
  strokeWeight(3) // 線條粗幼度
  noLoop()
  socket.emit("get-board")
  socket.on("show-board", (drawBoardObj) => { //display drawing from before joining the game to the board
    let boardArray = drawBoardObj.drawBoardArray;
    for (let emit of boardArray) {
      stroke(emit.selectedColor)
      strokeWeight(selectedStrokeWeight)
      line(emit.mouseX, emit.mouseY, emit.pmouseX, emit.pmouseY)

    }
  })
}

//can delete??
function draw() {
  // console.log('drawing')

  // Color button
  // stroke('black');
  // fill(255, 0, 0); // red // 變色按鈕顏色
  // rect(120, 590, 40, 40) // 變色按鈕座標和圖案
  // stroke('black')
  // fill(0, 255, 0); // green
  // rect(160, 590, 40, 40)
  // stroke('black')
  // fill(0, 0, 255); // blue
  // rect(200, 590, 40, 40)
  // stroke('black')
  // fill(255, 204, 0); // yellow
  // rect(240, 590, 40, 40)
  // stroke('black')
  // fill(0); // black
  // rect(280, 590, 40, 40)


  //make the button can switch the color
  // if (mouseIsPressed == true) {
  //   stroke(selectedColor);
  //   line(mouseX, mouseY, pmouseX, pmouseY);
  //   // socket.emit("new-line", { mouseX, mouseY, pmouseX, pmouseY }) // 傳送座標給server


  // }

  // if (mouseIsPressed) {
  //   if (mouseX > 120 && mouseX < 160 && mouseY > 590 && mouseY < 630) {
  //     selectedColor = 'red';
  //   } else if (mouseX > 160 && mouseX < 200 && mouseY > 590 && mouseY < 630) {
  //     selectedColor = 'green';
  //   } else if (mouseX > 200 && mouseX < 240 && mouseY > 590 && mouseY < 630) {
  //     selectedColor = 'blue';
  //   } else if (mouseX > 240 && mouseX < 280 && mouseY > 590 && mouseY < 630) {
  //     selectedColor = 'orange';
  //   } else if (mouseX > 280 && mouseX < 320 && mouseY > 590 && mouseY < 630) {
  //     selectedColor = 'black';
  //   } else if (mouseX > 0 && mouseX < 80 && mouseY > 605 && mouseY < 640) {
  //     background(255);
  //     selectedColor = 'black';
  //   }
  //   console.log("selectedColor: " + selectedColor)
  //   socket.emit("new-color", { selectedColor }) // 傳送selectedColor給server
  // }
  // textSize(25);
  // stroke('white')
  // text('Clear', 8, 630)


}

function mousePressed() {
  //update pmouse x and y for every new mouse press
  pmouseX = mouseX
  pmouseY = mouseY
  // console.log('pressed')
  // if (mouseX > 120 && mouseX < 160 && mouseY > 590 && mouseY < 630) {
  //   selectedColor = 'red';
  // } else if (mouseX > 160 && mouseX < 200 && mouseY > 590 && mouseY < 630) {
  //   selectedColor = 'green';
  // } else if (mouseX > 200 && mouseX < 240 && mouseY > 590 && mouseY < 630) {
  //   selectedColor = 'blue';
  // } else if (mouseX > 240 && mouseX < 280 && mouseY > 590 && mouseY < 630) {
  //   selectedColor = 'orange';
  // } else if (mouseX > 280 && mouseX < 320 && mouseY > 590 && mouseY < 630) {
  //   selectedColor = 'black';
  // } else if (mouseX > 0 && mouseX < 80 && mouseY > 605 && mouseY < 640) {
  //   background(255);
  //   selectedColor = 'black';
  //   console.log("selectedColor: " + selectedColor)
  //   socket.emit("new-color", { selectedColor }) // 傳送selectedColor給server
  mouseDragged()
  //   stroke('black');
  //   fill(255, 0, 0); // red // 變色按鈕顏色
  //   rect(120, 590, 40, 40) // 變色按鈕座標和圖案
  //   stroke('black')
  //   fill(0, 255, 0); // green
  //   rect(160, 590, 40, 40)
  //   stroke('black')
  //   fill(0, 0, 255); // blue
  //   rect(200, 590, 40, 40)
  //   stroke('black')
  //   fill(255, 204, 0); // yellow
  //   rect(240, 590, 40, 40)
  //   stroke('black')
  //   fill(0); // black
  //   rect(280, 590, 40, 40)
  //   textSize(25);
  //   stroke('white')
  //   text('Clear', 8, 630)

  // }
}
function mouseDragged() {
  // console.log('dragged')
  stroke(selectedColor)
  strokeWeight(selectedStrokeWeight)
  line(mouseX, mouseY, pmouseX, pmouseY)
  socket.emit("new-line", { mouseX, mouseY, pmouseX, pmouseY, selectedColor, selectedStrokeWeight }) // 傳送座標給server
  pmouseX = mouseX //update pmouseX Y manually
  pmouseY = mouseY
}



function keyPressed() {
  if (key == 's') {
    saveCanvas('myart.png');
  }
}