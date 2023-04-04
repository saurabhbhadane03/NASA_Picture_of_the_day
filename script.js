const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const currentImageContainer = document.querySelector("#current-image-container");
const searchHistoryList = document.querySelector("#search-history");

// API key for accessing the NASA API
const apiKey = "LCc8yC3V8qH2zpKDNlqx2G9jEKIw2kwPOhuNCX2a";

// Function to fetch the data for the current date from the NASA API
async function getCurrentImageOfTheDay() {
  const currentDate = new Date().toISOString().split("T")[0];
  const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${currentDate}`;

  const response = await fetch(apiUrl);
  const data = await response.json();

  currentImageContainer.innerHTML = `
    <h2>${data.title}</h2>
    <img src="${data.url}" alt="${data.title}">
    <p>${data.explanation}</p>
  `;
}

// Function to fetch the data for the selected date from the NASA API and display it in the UI
async function getImageOfTheDay(date) {
  const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`;

  const response = await fetch(apiUrl);
  const data = await response.json();

  currentImageContainer.innerHTML = `
    <h2>${data.title}</h2>
    <img src="${data.url}" alt="${data.title}">
    <p>${data.explanation}</p>
  `;

  // Save the date to local storage
  saveSearch(date);

  // Display the date in the search history list
  addSearchToHistory(date);
}

// Function to save a date to local storage
function saveSearch(date) {
  let searches = JSON.parse(localStorage.getItem("searches")) || [];

  if (!searches.includes(date)) {
    searches.push(date);
    localStorage.setItem("searches", JSON.stringify(searches));
  }
}

// Function to add a date to the search history list in the UI
function addSearchToHistory(date) {
  let searches = JSON.parse(localStorage.getItem("searches")) || [];

  searchHistoryList.innerHTML = searches
    .map(
      (search) =>
        `<li class="${search === date ? "active" : ""}">${search}</li>`
    )
    .join("");

  // Add click event listener to each search history list item
  searchHistoryList.querySelectorAll("li").forEach((item) => {
    item.addEventListener("click", () => {
      getImageOfTheDay(item.textContent);
    });
  });
}

// Event listener for form submission
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const searchDate = searchInput.value;

  // Clear search input field
  searchInput.value = "";

  getImageOfTheDay(searchDate);
});

// Run getCurrentImageOfTheDay function when the page loads
getCurrentImageOfTheDay();
