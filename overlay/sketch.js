let socket;
let words = [];

const NUM_LANES = 8;
const CROSS_SECONDS = 20;
const TEXT_FILL = [255, 255, 255];
const TEXT_STROKE = [0, 0, 0];
const FONT_STACK = "FusionPixel, 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif";

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
  textFont(FONT_STACK);
  textSize(max(10, round(height / 20 / 10) * 10));
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
  utter.lang = /[一-鿿]/.test(text) ? 'zh-CN' : 'en-US';
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
    const ts = textSize();
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
