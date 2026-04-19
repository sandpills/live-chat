let socket;
let words = [];

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
  textSize(20);
  textStyle(BOLD);
  noStroke();

  for (let i = words.length - 1; i >= 0; i--) {
    words[i].moveAndDisplay();
    if (words[i].x < -width) words.splice(i, 1);
  }
}

function displayMessageFromUser(greeting) {
  if (typeof greeting !== 'string' || greeting.length === 0) return;
  words.push(new Word(greeting, width, random(40, height - 40)));
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
    const tWidth = textWidth(this.word);
    rectMode(CENTER);
    fill(255, 255, 0);
    rect(this.x + 20, this.y - 30, tWidth + 20, 40);
    fill(0);
    textAlign(CENTER);
    text(this.word, this.x + 20, this.y - 20);
    this.x -= 3;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
