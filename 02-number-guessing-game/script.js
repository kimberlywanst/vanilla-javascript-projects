"use strict";

// Generates a random number (+1 so number can hit 30)
let answer = Math.floor(Math.random() * 30) + 1;
let lives = 5;
let rounds = 0;

const guessBox = document.querySelector(".guess-box");
const answerBox = document.querySelector(".answer-box");
const checkButton = document.getElementById("check-button");
const replayButton = document.getElementById("replay-button");

const displayMessage = (message) => {
  document.querySelector(".message").textContent = message;
};

const checkAnswer = () => {
  // Data from input field is stored as string, so need to convert to number
  const guess = Number(guessBox.value);

  // When there is no input
  if (!guess) {
    displayMessage("⚠️ No number entered");

    // When player wins
  } else if (guess === answer) {
    displayMessage("🎉 Correct number!");
    answerBox.textContent = answer;
    rounds++;
    document.getElementById("rounds").textContent = rounds;

    document.querySelector("body").style.backgroundColor = "#1C470E";
    answerBox.style.backgroundColor = "#95e0cc";
    answerBox.style.color = "#1c2638";
    answerBox.style.width = "16rem";
    checkButton.disabled = true;
    checkButton.style.backgroundColor = "grey";
    replayButton.style.backgroundColor = "#95e0cc";
    replayButton.style.color = "#1c2638";
  }
  // When guess is wrong
  else if (guess !== answer) {
    // Not "lives > 0" - otherwise message doesn't show "game over!" yet even when lives = 0
    if (lives > 1) {
      // if (guess > answer), true => too high; false => too low
      displayMessage(guess > answer ? "⬆️ Too high!" : "⬇️ Too low!");
      lives--;
      document.getElementById("lives").textContent = lives;

      // No lives left = game over
    } else {
      displayMessage("💀 Game over!");
      document.getElementById("lives").textContent = 0;
      checkButton.disabled = true;

      document.querySelector("body").style.backgroundColor = "#9b222b";
      checkButton.style.backgroundColor = "grey";
      replayButton.style.backgroundColor = "#95e0cc";
      replayButton.style.color = "#1c2638";
    }
  }
};

const replayGame = () => {
  // Generates a new random number
  answer = Math.floor(Math.random() * 30) + 1;
  lives = 5;
  document.getElementById("lives").textContent = lives;
  answerBox.textContent = "?";
  displayMessage("Start guessing...");
  guessBox.value = " ";

  document.querySelector("body").style.backgroundColor = "#1c2638";
  answerBox.style.width = "12rem";
  checkButton.disabled = false;
  checkButton.style.backgroundColor = "#1c2638";
  replayButton.style.backgroundColor = "#1c2638";
  replayButton.style.color = "#95e0cc";
};

checkButton.addEventListener("click", checkAnswer);
replayButton.addEventListener("click", replayGame);
