let socket;
let words = [];

const NUM_LANES = 8;
const CROSS_SECONDS = 20;
const TEXT_FILL = [255, 255, 255];   // white — swap to e.g. [255,0,0] if your key still catches it
const TEXT_STROKE = [0, 0, 0];       // black outline

function setup() {
  createCanvas(windowWidth, windowHeight);
  socket = io();
  socket.on('greetingFromUser', displayMessageFromUser);
}

function mousePressed() {
  speakWithLang('viola haha');
}

function draw() {
  background(0, 255, 0); // green screen for keying
  textFont('monaco');
  textSize(height / 20);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);

  for (let i = words.length - 1; i >= 0; i--) {
    words[i].moveAndDisplay();
    if (words[i].x < -width * 0.2) words.splice(i, 1);
  }
}

function displayMessageFromUser(greeting) {
  if (typeof greeting !== 'string' || greeting.length === 0) return;
  const laneIndex = floor(random(NUM_LANES));
  const laneHeight = height / NUM_LANES;
  const pad = laneHeight * 0.15;
  const y = laneIndex * laneHeight + random(pad, laneHeight - pad);
  words.push(new Word(greeting, width, y));
  speakWithLang(greeting);
}

let speechQueue = [];
let speaking = false;

function speakWithLang(text) {
  if (!('speechSynthesis' in window)) return;
  speechQueue.push(text);
  playNextUtterance();
}

function playNextUtterance() {
  if (speaking || speechQueue.length === 0) return;
  speaking = true;
  const text = speechQueue.shift();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = /[\u4e00-\u9fff]/.test(text) ? 'zh-CN' : 'en-US';
  utter.onend = () => { speaking = false; playNextUtterance(); };
  utter.onerror = () => { speaking = false; playNextUtterance(); };
  window.speechSynthesis.speak(utter);
}

class Word {
  constructor(word, x, y) {
    this.word = word;
    this.x = x;
    this.y = y;
  }

  moveAndDisplay() {
    const ts = height / 23;
    stroke(TEXT_STROKE);
    strokeWeight(ts * 0.2);
    fill(TEXT_FILL);
    text(this.word, this.x, this.y);

    this.x -= width / (CROSS_SECONDS * 60);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
