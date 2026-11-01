"use strict";

// ---------------------------------------------------------
// EARTHQUAKE FILTER
// Filters the sample earthquake cards by magnitude.
// ---------------------------------------------------------

// Get the magnitude dropdown from the page.
const magnitudeFilter = document.querySelector("#magnitude");

// Get all earthquake cards.
const earthquakeCards = document.querySelectorAll(".earthquake-card");

// Listen for a change in the dropdown menu.
magnitudeFilter.addEventListener("change", function () {

    // Get the selected magnitude value.
    const selectedMagnitude = magnitudeFilter.value;

    // Check each earthquake card.
    earthquakeCards.forEach(function (card) {

        // Find the magnitude text inside the card.
        const magnitudeText = card.querySelector("p").textContent;

        // Pull the number out of the text.
        const magnitude = parseFloat(magnitudeText.replace("Magnitude:", ""));

        // Show all cards if "All Earthquakes" is selected.
        if (selectedMagnitude === "all") {
            card.style.display = "block";
        }

        // Otherwise, only show earthquakes at or above
        // the selected magnitude.
        else if (magnitude >= Number(selectedMagnitude)) {
            card.style.display = "block";
        }

        // Hide earthquakes that do not meet the filter.
        else {
            card.style.display = "none";
        }
    });
});