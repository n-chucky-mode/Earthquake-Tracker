
"use strict";

// ---------------------------------------------------------
// EARTHQUAKE DATA
// Retrieves real earthquake information from the USGS.
// ---------------------------------------------------------

// USGS earthquake data from the past 24 hours.
const earthquakeURL =
    "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// ---------------------------------------------------------
// EARTHQUAKE FILTER
// Filters the earthquake cards by magnitude.
// ---------------------------------------------------------

// Get the magnitude dropdown from the page.
const magnitudeFilter = document.querySelector("#magnitude");

// Get the container where earthquake cards will appear.
const earthquakeContainer = document.querySelector("#earthquake-list");


// Listen for a change in the dropdown menu.
magnitudeFilter.addEventListener("change", filterEarthquakes);
//****************************************************************************** */

// Filter the cards using the selected magnitude.
function filterEarthquakes() {

    // Get the selected magnitude value.
    const selectedMagnitude = magnitudeFilter.value;

    // Get all earthquake cards, including newly created ones.
    const cards = document.querySelectorAll(".earthquake-card");

    // Check each earthquake card.
    cards.forEach(function (card) {

        // Find the magnitude text inside the card.
        const magnitudeText = card.querySelector("p").textContent;

        // Pull the number out of the text.
        const magnitude = parseFloat(
            magnitudeText.replace("Magnitude:", "")
        );

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
}

// ---------------------------------------------------------
// FETCH EARTHQUAKE DATA
// ********* Connects to the USGS using the Fetch API.***************
// ---------------------------------------------------------

async function getEarthquakes() {

    // Make sure the earthquake container exists.
    if (!earthquakeContainer) {
        console.error("Earthquake card container not found.");
        return;
    }

    try {

        // Request earthquake information from USGS.
        const response = await fetch(earthquakeURL);

        // Check whether the request was successful.
        if (!response.ok) {
            throw new Error("Unable to retrieve earthquake data.");
        }

        // Convert the response into JavaScript data.
        const data = await response.json();

        // Display the earthquakes on the page.
        displayEarthquakes(data.features);

    } catch (error) {

        // Display an error if the data cannot be retrieved.
        console.error("Error loading earthquakes:", error);
    
        // Show a message on the webpage if the request fails.
        earthquakeContainer.textContent =
            "Unable to load earthquake data. Please try again later.";
    }
}

// ---------------------------------------------------------
// DISPLAY EARTHQUAKES
// Creates earthquake cards using real USGS data.
// ---------------------------------------------------------

function displayEarthquakes(earthquakes) {

    // Clear the loading message before displaying earthquakes.
    earthquakeContainer.replaceChildren();

    // Display the 10 most recent reported earthquakes.
    earthquakes.slice(0, 10).forEach(function (earthquake) {

        // Get the earthquake details.
        const magnitude = earthquake.properties.mag;
        const location = earthquake.properties.place;
        const time = earthquake.properties.time;

        // Skip earthquakes without a valid magnitude.
        if (typeof magnitude !== "number") {
            return;
        }

        // Create a new earthquake card.
        const card = document.createElement("div");
        card.classList.add("earthquake-card");

        // Create the location heading.
        const heading = document.createElement("h3");
        heading.textContent = location || "Unknown location";

        // Create the magnitude paragraph.
        const magnitudeParagraph = document.createElement("p");
        magnitudeParagraph.textContent =
            "Magnitude: " + magnitude.toFixed(1);

        // Create the date paragraph.
        const dateParagraph = document.createElement("p");
        dateParagraph.textContent =
            "Date: " + new Date(time).toLocaleString();

        // Add the information to the card.
        card.appendChild(heading);
        card.appendChild(magnitudeParagraph);
        card.appendChild(dateParagraph);

        // Add the card to the webpage.
        earthquakeContainer.appendChild(card);
    });

    // Apply the currently selected magnitude filter.
    filterEarthquakes();
}

// ---------------------------------------------------------
// START APPLICATION
// Load earthquake data when the page opens.
// ---------------------------------------------------------

getEarthquakes();


 // ---------------------------------------------------------
 // INTERACTIVE EARTHQUAKE MAP
 // Creates a world map using the Leaflet library.
 // ---------------------------------------------------------

 // Create the map inside the earthquake-map HTML container.
 // The coordinates [20, 0] center the map on a world view.
 // The number 2 sets the starting zoom level.
 const earthquakeMap = L.map("earthquake-map").setView([20, 0], 2);

 // Add OpenStreetMap tiles to display the world map.
 L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
     attribution: '&copy; OpenStreetMap contributors',
     maxZoom: 18
 }).addTo(earthquakeMap);

