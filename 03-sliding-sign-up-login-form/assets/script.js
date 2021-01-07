const signUpButton = document.getElementById("signUp");
const loginButton = document.getElementById("login");
const container = document.getElementById("container");

// Adds .right-panel-active class to .container (refer style.css line 305)
signUpButton.addEventListener("click", () => {
  container.classList.add("right-panel-active");
});

loginButton.addEventListener("click", () => {
  container.classList.remove("right-panel-active");
});
