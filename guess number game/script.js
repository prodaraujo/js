'use strict';

let secretNumber = Math.trunc(Math.random() * 20) + 1;
let score = 20;
let highscore = 0;

const displayMessage = msg => {
  document.querySelector('.message').textContent = msg;
};

const guessNumber = () => {
  score = 20;
  secretNumber = Math.trunc(Math.random() * 20) + 1;
  document.querySelector('body').style.backgroundColor = '#222';
  document.querySelector('.number').style.width = '15rem';
  document.querySelector('.number').innerHTML = '?';
  document.querySelector('.guess').value = '';
  document.querySelector('.score').textContent = score;
  displayMessage('Start guessing...');
};

const scoreDecr = () => {
  return (document.querySelector('.score').textContent = --score);
};

const bestScore = () => {
  if (score > highscore) {
    highscore = score;
    return document.querySelector('.highscore').textContent = score;
  }
};

document.querySelector('.check').addEventListener('click', event => {
  const num = Number(document.querySelector('.guess').value);

  if (score === 0) {
    displayMessage('💣 You lost the game!');
  } else if (!num) {
    displayMessage('⛔ No number!');
  } else if (num === secretNumber) {
    document.querySelector('body').style.backgroundColor = '#60b347';
    document.querySelector('.number').innerHTML = secretNumber;
    document.querySelector('.number').style.width = '30rem';
    displayMessage('🎉 Correct number!');
    bestScore();
  } else if (num !== secretNumber) {
    displayMessage(num > secretNumber ? '📈 Too high!' : '📉 Too low!');
    scoreDecr();
  }
});

document
  .querySelector('.again')
  .addEventListener('click', event => guessNumber());

window.addEventListener('DOMContentLoaded', guessNumber);