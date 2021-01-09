"use strict";

// Selecting elements
const elPlayer0 = document.getElementById("player--0");
const elPlayer1 = document.getElementById("player--1");
const elTotal0 = document.getElementById("total--0");
const elTotal1 = document.getElementById("total--1");
const elCurrent0 = document.getElementById("current--0");
const elCurrent1 = document.getElementById("current--1");

const elDice = document.querySelector(".dice");
const btnReset = document.querySelector(".btn-reset");
const btnRoll = document.querySelector(".btn-roll");
const btnHold = document.querySelector(".btn-hold");

let totalScores, currentScore, activePlayer, playing;

// Starting conditions
const init = () => {
  totalScores = [0, 0]; // Total scores of both players
  currentScore = 0;
  activePlayer = 0; // To track which player is currently playing & allocate scores to
  playing = true;

  elTotal0.textContent = 0;
  elTotal1.textContent = 0;
  elCurrent0.textContent = 0;
  elCurrent1.textContent = 0;

  elDice.classList.add("hidden");
  elPlayer0.classList.add("active--player");
  elPlayer1.classList.remove("active--player");
  elPlayer0.classList.remove("winner");
  elPlayer1.classList.remove("winner");
};

init();

const switchPlayer = () => {
  // Reset previous player score to 0
  document.getElementById(`current--${activePlayer}`).textContent = 0;
  // Reassign next active player
  activePlayer = activePlayer === 0 ? 1 : 0;
  // Next player starts game
  currentScore = 0;

  // Highlight active player section
  elPlayer0.classList.toggle("active--player");
  elPlayer1.classList.toggle("active--player");
};

// Rolling dice functionality
btnRoll.addEventListener("click", () => {
  // If still playing
  if (playing) {
    // 1. Generate random dice roll
    const dice = Math.floor(Math.random() * 6) + 1;

    // 2. Display dice
    elDice.classList.remove("hidden");
    elDice.src = `assets/images/dice-${dice}.png`;

    // 3. Check for "1" rolled
    // Add dice to current score
    if (dice !== 1) {
      currentScore += dice;
      // Dynamically allocate current score based on active player
      document.getElementById(
        `current--${activePlayer}`
      ).textContent = currentScore;

      // Switch to next player
    } else {
      switchPlayer();
    }
  }
});

// Holding current score functionality
btnHold.addEventListener("click", () => {
  if (playing) {
    // 1. Add current score to active player's total
    totalScores[activePlayer] += currentScore;

    document.getElementById(`total--${activePlayer}`).textContent =
      totalScores[activePlayer];

    // 2. Check if player's score >= 100
    if (totalScores[activePlayer] >= 100) {
      // Finish the game
      // (btnRoll & btnHold don't do anything now)
      playing = false;
      elDice.classList.add("hidden");

      document
        .getElementById(`player--${activePlayer}`)
        .classList.add("winner");
      document
        .getElementById(`player--${activePlayer}`)
        .classList.remove("active--player");

      // Else switch to next player
    } else {
      switchPlayer();
    }
  }
});

btnReset.addEventListener("click", init);
