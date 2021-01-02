const hex = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "A", "B", "C", "D", "E", "F"];
const btnCopy = document.getElementById("btn-copy");
const btnColour = document.getElementById("btn-colour");
const colourCode = document.getElementById("colour-code");

const copyToClipboard = () => {
  let tempInput = document.createElement("input");
  tempInput.value = document.getElementById("colour-code").innerHTML;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand("copy");
  alert("Copied " + tempInput.value);
  document.body.removeChild(tempInput);
};

btnCopy.addEventListener("click", copyToClipboard);

const getIndex = () => {
  return Math.floor(Math.random() * hex.length);
};

// Generate 6 digit hex code
const getRandomColour = () => {
  let hexCode = "#";
  for (let i = 0; i < 6; i++) {
    hexCode += hex[getIndex()];
  }

  colourCode.innerHTML = hexCode;
  document.body.style.backgroundColor = hexCode;
};

btnColour.addEventListener("click", getRandomColour);
