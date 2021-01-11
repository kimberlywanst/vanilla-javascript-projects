const gallery = document.querySelector(".gallery");
const overlay = document.querySelector(".overlay");
const overlayImage = document.querySelector("img");
const overlayClose = document.querySelector(".btn-close");

// Generate HTML functionality
// Pass in 11 as randomNumber argument as have 11 images
const generateHTML = ([height, width]) => {
  return `
    <div class="item h${height} w${width}">
        <img src="images/${randomNumber(11)}.jpg">
        <div class="item--overlay">
            <button>View →</button>
        </div>
    </div>
    `;
};

// Generates random number used for random height & width of images
const randomNumber = (limit) => {
  return Math.floor(Math.random() * limit) + 1;
};

// Creates 20 new random "digits" Array instances
// .concat used to fill up empty spaces with [1,1] images
const digits = Array.from({ length: 30 }, () =>
  [randomNumber(3), randomNumber(3)].concat([
    [1, 1],
    [1, 1],
    [1, 1],
    [1, 1],
    [1, 1],
    [1, 1],
    [1, 1],
    [1, 1],
    [1, 1],
    [1, 1],
    [1, 1],
    [1, 1],
    [1, 1],
    [1, 1],
    [1, 1],
    [1, 1],
    [1, 1],
    [1, 1],
    [1, 1],
    [1, 1],
  ])
);

// Passes each "digits" array into "generateHTML" function
const html = digits.map(generateHTML).join("");

// Generates random images in HTML
gallery.innerHTML = html;

// Returns .item whose event listeners triggered click event
const handleClick = (event) => {
  // Search for "src" attribute inside "image" tag of .item
  const src = event.currentTarget.querySelector("img").src;
  overlayImage.src = src;
  overlay.classList.add("open");
};

const close = () => {
  overlay.classList.remove("open");
};

// Overlay appears when image is clicked
const items = document.querySelectorAll(".item");

items.forEach((item) => {
  item.addEventListener("click", handleClick);
});

// Closes overlay when "x" button clicked
overlayClose.addEventListener("click", close);

// Closes overlay when esc button hit
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    close();
  }
});

// Closes overlay when click out of modal
overlay.addEventListener("click", close);
