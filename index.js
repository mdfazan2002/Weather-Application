const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

//initially vairables need????

let oldTab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
oldTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(newTab) {
    if(newTab != oldTab) {
        oldTab.classList.remove("current-tab");
        oldTab = newTab;
        oldTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")) {
            //kya search form wala container is invisible, if yes then make it visible
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else {
            //main pehle search wale tab pr tha, ab your weather tab visible karna h 
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            //ab main your weather tab me aagya hu, toh weather bhi display karna poadega, so let's check local storage first
            //for coordinates, if we haved saved them there.
            getfromSessionStorage();
        }
    }
}

userTab.addEventListener("click", () => {
    //pass clicked tab as input paramter
    switchTab(userTab);
});

searchTab.addEventListener("click", () => {
    //pass clicked tab as input paramter
    switchTab(searchTab);
});

//check if cordinates are already present in session storage
function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates) {
        //agar local coordinates nahi mile
        grantAccessContainer.classList.add("active");
    }
    else {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }

}

async function fetchUserWeatherInfo(coordinates) {
    const {lat, lon} = coordinates;
    // make grantcontainer invisible
    grantAccessContainer.classList.remove("active");
    //make loader visible
    loadingScreen.classList.add("active");

    //API CALL
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
          );
        const  data = await response.json();
        console.log(data);

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err) {
        loadingScreen.classList.remove("active");
        //HW

    }

}

// function renderWeatherInfo(weatherInfo) {
//     //fistly, we have to fethc the elements 

//     const cityName = document.querySelector("[data-cityName]");
//     const countryIcon = document.querySelector("[data-countryIcon]");
//     const desc = document.querySelector("[data-weatherDesc]");
//     const weatherIcon = document.querySelector("[data-weatherIcon]");
//     const temp = document.querySelector("[data-temp]");
//     const realfeel = document.querySelector("[realfeel]");
//     const windspeed = document.querySelector("[data-windspeed]");
//     const humidity = document.querySelector("[data-humidity]");
//     const cloudiness = document.querySelector("[data-cloudiness]");
//     const sunrise = document.querySelector(["sunrise"]);
//     console.log(weatherInfo);

//     //fetch values from weatherINfo object and put it UI elements
//     cityName.innerText = weatherInfo?.name;
//     countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
//     desc.innerText = weatherInfo?.weather?.[0]?.description;
//     weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
//     temp.innerText = `${weatherInfo?.main?.temp} °C`;
//     realfeel.innerText= `${weatherInfo?.main?.feels_like}°C`;
//     windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
//     humidity.innerText = `${weatherInfo?.main?.humidity}%`;
//     cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
//     // Extract sunrise and sunset timestamps from the "sys" object
//      sunrise = `${weatherInfo?.sys?.sunrise}`;
//       sunset =   `${weatherInfo?.sys?.sunrise}`;

// // Convert the timestamps to human-readable date and time in IST timezone 
//      sunrise.innerText = new Date(sunriseTimestamp * 1000).toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata' });
//      sunset.innerText = new Date(sunsetTimestamp * 1000).toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata' });

// // Output the results
// console.log("Sunrise (IST):", sunriseTime);
// console.log("Sunset (IST):", sunsetTime);

// }
function renderWeatherInfo(weatherInfo) {
    // Fetching elements from the DOM
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const realfeel = document.querySelector("[realfeel]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");
    const sunriseElement = document.querySelector("[sunrise]"); // Assuming you have an element with data-sunrise attribute
    const sunsetElement = document.querySelector("[sunset]"); // Assuming you have an element with data-sunset attribute

    // Assigning values from weatherInfo to DOM elements
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    realfeel.innerText = `${weatherInfo?.main?.feels_like}°C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;

    // Extract sunrise and sunset timestamps from the "sys" object
    const sunriseTimestamp = weatherInfo?.sys?.sunrise;
    const sunsetTimestamp = weatherInfo?.sys?.sunset;

    // Convert the timestamps to human-readable date and time in IST timezone
    const sunriseTime = new Date(sunriseTimestamp * 1000).toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata' });
    const sunsetTime = new Date(sunsetTimestamp * 1000).toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata' });

    // Set the inner text of the sunrise and sunset elements
    sunriseElement.innerText = `Sunrise: ${sunriseTime}`;
    sunsetElement.innerText = `Sunset: ${sunsetTime}`;
}

function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        //HW - show an alert for no gelolocation support available
    }
}

function showPosition(position) {

    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);

}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
        return;
    else 
        fetchSearchWeatherInfo(cityName);
})
const errormsg = document.querySelector(".error-container")
async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );
        if (response.ok) {
            const data = await response.json();
            loadingScreen.classList.remove("active");
            userInfoContainer.classList.add("active");
            errormsg.classList.remove("active");
            renderWeatherInfo(data);
        } else {
            // City not found or weather data unavailable
            loadingScreen.classList.remove("active");
            userInfoContainer.classList.remove("active");
            errormsg.classList.add("active");
            // Hide other error messages
            document.querySelector(".error-message").classList.add("active");
            // Display 404 error image
            document.querySelector(".error-container img").classList.add("active");
        }
    }
    catch(err) {
        // Handle other errors if needed
        console.error("Error fetching weather data:", err);
        // Display an error message to the user
        alert("An error occurred while fetching weather data. Please try again later.");
    }
}
