let video,flipVideo;
let label = "waiting...";

// The classifier
let classifier;
let modelURL = 'https://teachablemachine.withgoogle.com/models/UCeiif5De/';

// STEP 1: Load the model!
function preload() {
  classifier = ml5.imageClassifier(modelURL + 'model.json');
}

// Snake Game Variables
let snake;
let rez = 30;
let food;
let w,h;

function setup() {
  createCanvas(500, 480);
  // Create the video
  video = createCapture(VIDEO);
  video.size(500, 480);
  video.hide();
  // Mirro the video since we trained it that way!
  flipVideo = ml5.flipImage(video);

  // STEP 2: Start classifying
  classifyVideo();

  // Snake Game
  w = floor(width / rez);
  h = floor(height / rez);
  frameRate(5);
  snake = new Snake();
  foodLocation();
}

// STEP 2 classify!
function classifyVideo() {
  // Flip the video!
  flipVideo = ml5.flipImage(video);
  classifier.classify(flipVideo, gotResults);
}

// Snake Gahttps://teachablemachine.withgoogle.com/models/UCeiif5De/
function foodLocation() {
  let x = floor(random(w));
  let y = floor(random(h));
  food = createVector(x, y);
}

// Control the game based on the label
function controlSnake() {
  if (label === "Class 1") {
    snake.setDir(-1, 0);
  } else if (label === "Class 2") {
    snake.setDir(1, 0);
  } else if (label === "Class 3") {
    snake.setDir(0, 1);
  } else if (label === "Class 4") {
    snake.setDir(0, -1);
  }
}

function draw() {
  background(255);

  // Draw the video?
  image(flipVideo, 0, 0);
  textSize(32);
  fill(0);
  text(label, 10, 50);
  textSize(12);


  // Draw the game
  scale(rez);
  if (snake.eat(food)) {
    foodLocation();
  }
  snake.update();
  snake.show();

  if (snake.endGame()) {
    print("END GAME");
    background(0, 0, 0);
    noLoop();
  }

  noStroke();
  fill(255, 0, 0);
  rect(food.x, food.y, 1, 1);
}

// STEP 3: Get the classification!
function gotResults(error, results) {
  if (error) {
    console.error(error);
    return;
  }
  label = results[0].label;
  // Control the snake and classify again!
  controlSnake();
  classifyVideo();
}
