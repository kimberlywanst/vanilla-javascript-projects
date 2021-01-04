# Number Guessing Game

## About

Guess the correct number between 1 and 30. You only have 5 guesses before it's game over! How many rounds can you win without any losing streak?

![](../00-assets/images/projects/markdown/02-number-guessing-game.jpg)

## Logic

Used `Math.floor(Math.random())` to generate a random number between 1 and 30.

Event listeners on buttons were used to:

- Check if player's guess was equivalent to random number
- Restart the game if player won/ lost after 5 guesses

`if...else` statement was used for game logic:

- When there is no number was inputted
- When player wins the game
- When player guesses wrongly
