"use strict";

// OBJECT CLASSES

// Parent class
class Workout {
  id = (Date.now() + "").slice(-10); // create id from current date
  date = new Date();

  //constructor(id, date, coords, distance, duration) {
  constructor(coords, distance, duration) {
    // this.id = (Date.now() + " ").slice(-10); // create id from current date
    // this.date = new Date();
    this.coords = coords; // [lat, lng]
    this.distance = distance; // km
    this.duration = duration; // min
  }

  _setDescription() {
    // prettier-ignore
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }
}

// Child classes
class Running extends Workout {
  type = "running";

  constructor(coords, distance, duration, cadence) {
    // Create instance with parent properties
    super(coords, distance, duration);
    this.cadence = cadence; // step/min
    // this.type = "running";
    this.calcPace();
    this._setDescription();
  }

  calcPace() {
    this.pace = this.duration / this.distance;
    return this.pace; // min/km
  }
}

class Cycling extends Workout {
  type = "cycling";

  constructor(coords, distance, duration, elevation) {
    // Create instance with parent properties
    super(coords, distance, duration);
    this.elevation = elevation; // meters
    // this.type = "cycling";
    this.calcSpeed();
    this._setDescription();
  }

  calcSpeed() {
    this.speed = this.distance / (this.duration * 60);
    return this.speed; // km/h
  }
}

/////////////////////////////////////////////////////////////////////////////////////
// APPLICATION ARCHITECTURE
const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form-input_type");
const inputDistance = document.querySelector(".form-input_distance");
const inputDuration = document.querySelector(".form-input_duration");
const inputCadence = document.querySelector(".form-input_cadence");
const inputElevation = document.querySelector(".form-input_elevation");

class App {
  // Called immediately when new object created
  constructor() {
    this.mapZoomLevel = 15;

    // Store new instances
    this.workouts = [];

    // Get user's current position
    this._getPosition();

    // Retrieve existing workouts from local storage
    this._getLocalStorage();

    // Create new workout when form submitted
    form.addEventListener("submit", this._newWorkout.bind(this)); // point back to object

    // Toggle between workout types
    inputType.addEventListener("change", this._toggleElevationField);

    // Moves map view to a drop pin
    containerWorkouts.addEventListener("click", this._moveToPopup.bind(this));
  }

  get map() {
    return this._map;
  }

  get mapEvent() {
    return this._mapEvent;
  }

  set map(value) {
    this._map = value;
  }

  set mapEvent(value) {
    this._mapEvent = value;
  }

  _getPosition() {
    if (navigator.geolocation) {
      // .bind() returns current map object
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert(`Could not get your current location`);
        }
      );
    }
  }

  _loadMap(position) {
    // Extract coordinates using destructuring
    const { latitude } = position.coords; // position.coords.latitude
    const { longitude } = position.coords; // position.coords.longitude
    const coords = [latitude, longitude];

    // Using Leaflet library
    // Initialise map using Leaflet function based on coordinates & zoom level
    this.map = L.map("map").setView(coords, this.mapZoomLevel);

    // Create Mapbox Streets tiles to build map
    L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    // Leaflet method equivalent for .addEventListener
    this.map.on("click", this._showForm.bind(this)); // point back to object

    // Render drop pin markers on map
    this.workouts.forEach((work) => {
      this._renderWorkoutMarker(work);
    });
  }

  _showForm(mapE) {
    this.mapEvent = mapE;
    form.classList.remove("hidden");
    inputDistance.focus();
  }

  _hideForm() {
    // Clear inputs in form
    inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value =
      "";

    form.style.display = "none";
    form.classList.add("hidden");
    setTimeout(() => {
      form.style.display = "grid";
    }, 1000);
  }

  _toggleElevationField() {
    // Select closest div parent element
    inputCadence.closest(".form-row").classList.toggle("form-row_hidden");
    inputElevation.closest(".form-row").classList.toggle("form-row_hidden");
  }

  _newWorkout(event) {
    // Get data from input form
    const type = inputType.value;
    const distance = Number(inputDistance.value); // converts string to number
    const duration = Number(inputDuration.value);
    const { lat, lng } = this.mapEvent.latlng; // Deconstruct coordinates from map object
    let workout;

    // Validate data is numbers
    // Returns false if one input isn't a number
    const validInputs = (...inputs) =>
      inputs.every((inp) => Number.isFinite(inp));
    // !Number.isFinite(distance) ||
    // !Number.isFinite(duration) ||
    // !Number.isFinite(cadence)

    // Validate data is positive number
    const positiveInputs = (...inputs) => inputs.every((inp) => inp > 0);

    // Prevent page refresh when form submitted
    event.preventDefault();

    // If workout running, create running object
    if (type === "running") {
      const cadence = +inputCadence.value;

      // Validate data is positive numbers
      if (
        !validInputs(distance, duration, cadence) ||
        !positiveInputs(distance, duration, cadence)
      ) {
        return alert("Please enter a positive number");
      }

      workout = new Running([lat, lng], distance, duration, cadence);
    }

    // If workout cycling, create cycling object
    if (type === "cycling") {
      const elevation = Number(inputElevation.value); // convert string to number

      // Validate data is positive numbers
      if (
        !validInputs(distance, duration, elevation) ||
        !positiveInputs(distance, duration)
      ) {
        return alert("Please enter a positive number");
      }

      workout = new Running([lat, lng], distance, duration, elevation);
    }

    // Add new object to workout array
    this.workouts.push(workout);
    console.log(workout);

    // Render workout on map as drop pin
    this._renderWorkoutMarker(workout);

    // Render workout on list
    this._renderWorkout(workout);

    // Hide form & clear input fields
    this._hideForm();

    // Store all workouts in local storage
    this._setLocalStorage();
  }

  _renderWorkoutMarker(workout) {
    // Create drop pin & add to map (using Leaflet library)
    L.marker(workout.coords)
      .addTo(this.map)
      // Create popup object on each drop pin
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(
        `${workout.type === "running" ? "🏃" : "🚴"} ${workout.description}`
      )
      .openPopup();
  }

  _renderWorkout(workout) {
    let html = `
      <li class="workout workout-${workout.type}" date-id="${workout.id}">
        <h2 class="workout-title">${workout.description}</h2>
        <div class="workout-details">
          <span class="workout-icon">${
            workout.type === "running" ? "🏃" : "🚴"
          }</span>
          <span class="workout-value">${workout.distance}</span>
          <span class="workout-unit">km</span>
        </div>
        <div class="workout-details">
          <span class="workout-icon">⏱️</span>
          <span class="workout-value">${workout.duration}</span>
          <span class="workout-unit">min</span>
        </div>
    `;

    if (workout.type === "running") {
      html += `
        <div class="workout-details">
          <span class="workout-icon">⚡️</span>
          <span class="workout-value">${workout.pace.toFixed(1)}</span>
          <span class="workout-unit">min/km</span>
        </div>
        <div class="workout-details">
          <span class="workout-icon">🦶</span>
          <span class="workout-value">${workout.cadence}</span>
          <span class="workout-unit">spm</span>
        </div>
      </li>
      `;
    }

    if (workout.type === "cycling") {
      html += `
        <div class="workout-details">
          <span class="workout-icon">⚡️</span>
          <span class="workout-value">${workout.speed.toFixed(1)}</span>
          <span class="workout-unit">km/h</span>
        </div>
        <div class="workout-details">
          <span class="workout-icon">🚵‍♂️</span>
          <span class="workout-value">${workout.elevation}</span>
          <span class="workout-unit">m</span>
        </div>
      </li>
      `;
    }

    // Insert workout details as sibling div in form
    form.insertAdjacentHTML("afterend", html);
  }

  _moveToPopup(event) {
    if (!this.map) return;

    // Selects specific li workout element with unique id
    const workoutEl = event.target.closest(".workout");
    console.log(workoutEl);

    if (!workoutEl) return;

    // Get workout data from workouts array
    const workout = this.workouts.find((work) => {
      work.id === workoutEl.dataset.id; // method to access custom data attribute BUG: dataset.id undefined
    });

    // Use workout id to move map to coords (Leaflet library)
    this.map.setView(workout.coords, this.mapZoomLevel, {
      animate: true,
      pan: {
        duration: 1,
      },
    });
  }

  // Converts objects to strings to store in local storage
  _setLocalStorage() {
    localStorage.setItem("workouts", JSON.stringify(this.workouts));
  }

  // Converts data from local storage back to objects (Executed when page loads)
  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem("workouts"));

    if (!data) return;

    // Restore existing workouts when page reloads (instead of empty array)
    this.workouts = data;

    // Render workouts on page
    this.workouts.forEach((work) => {
      this._renderWorkout(work); // Render workouts in list
    });
  }

  // Clear existing workouts from local storage
  reset() {
    localStorage.removeItem("workouts");
    location.reload();
  }
}

// Create app object on page load
const appWorkout = new App();
