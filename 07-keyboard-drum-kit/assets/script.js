const playSound = (event) => {
  const audio = document.querySelector(`audio[data-key="${event.code}"]`);

  //Add animation when key pressed
  const key = document.querySelector(`.key[data-key="${event.code}"]`);

  // Stops function from running if no audio exists
  if (!audio) return;

  key.classList.add("playing");

  // Rewind audio to the start
  audio.currentTime = 0;
  // Built-in method to play audio
  audio.play();
};

const removeTransition = (event) => {
  // Skip other CSS properties
  if (event.propertyName !== "transform") return;

  // <div data-key="..." class="key playing">...</div>
  event.target.classList.remove("playing");
};

const keys = document.querySelectorAll(".key");

// keys is a NodeList, so must loop over every element to attach event listeners to each .key.playing
// "transitionend" event to remove highlighted key animations
keys.forEach((key) => {
  key.addEventListener("transitionend", removeTransition);
});

// Listen for key pressed
window.addEventListener("keydown", playSound);
