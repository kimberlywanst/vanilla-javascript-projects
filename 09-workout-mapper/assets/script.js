"use strict";

/////////////////////////////////////////////////////////////////////////////////////
// APPLICATION ARCHITECTURE
const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form-input_type");
const inputDistance = document.querySelector(".form-input_distance");
const inputDuration = document.querySelector(".form-input_duration");
const inputCadence = document.querySelector(".form-input_cadence");
const inputElevation = document.querySelector(".form-input_elevation");

// Get current location of user
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    function (position) {
      // Extract coordinates using destructuring
      const { latitude } = position.coords;
      const { longitude } = position.coords;
      const coords = [latitude, longitude];
      console.log(`${coords}`);
    },
    function () {
      alert(`Could not get your current location`);
    }
  );
}
