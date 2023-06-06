const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

let currentTab=userTab;
let API_KEY="75c0333ea3f1f2f160226dafb56fd36c"
let URL2="https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}"

currentTab.classList.add("current-tab");
getFromSessionStorage();


//switch tab
function switchTab(clickedTab){
    if (clickedTab!=currentTab) {
        currentTab.classList.remove("current-tab")
        currentTab=clickedTab;
        currentTab.classList.add("current-tab")

        if(!searchForm.classList.contains("active")){
            //agar search form wala container invisible hai then make it visible
            grantAccessContainer.classList.remove("active");
            userInfoContainer.classList.remove("active");
            searchForm.classList.add("active");
        }else{
            searchForm.classList.remove("active")
            userInfoContainer.classList.remove("active");
            //ab mein your weather tab mein hu,toh weather bhi display karna hoga ,so lets check local storage first
            getFromSessionStorage();
        }
    }
}

userTab.addEventListener("click",()=>{
    switchTab(userTab);
});

searchTab.addEventListener("click",()=>{
    switchTab(searchTab);
});


//below function check if coordinates present in session storage
function getFromSessionStorage(){

    const localCoordinates=sessionStorage.getItem("user-coordinate");

    if (!localCoordinates) {
        grantAccessContainer.classList.add("active")
    } else {
        const coordinates=JSON.parse(localCoordinates)
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat,lon}=coordinates;

     //make grantContainer active
    grantAccessContainer.classList.add("active");
     //make loader active
     loadingScreen.classList.add("active");


     //API call
    try {
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`)
        const data=await response.json();


        // grantAccessContainer.classList.remove("active")
        loadingScreen.classList.remove("active")
        userInfoContainer.classList.add("active")
         renderWeatherInfo(data);
    } catch (error) {
        grantAccessContainer.classList.remove("active")
    }


}

function renderWeatherInfo(weatherInfo){
     //fistly, we have to fetch the elements 

     const cityName = document.querySelector("[data-cityName]");
     const countryIcon = document.querySelector("[data-countryIcon]");
     const desc = document.querySelector("[data-weatherDesc]");
     const weatherIcon = document.querySelector("[data-weatherIcon]");
     const temp = document.querySelector("[data-temp]");
     const windspeed = document.querySelector("[data-windspeed]");
     const humidity = document.querySelector("[data-humidity]");
     const cloudiness = document.querySelector("[data-cloudiness]");


      //fetch values from weatherINfo object and put it UI elements
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = weatherInfo?.main?.temp;
    windspeed.innertext = weatherInfo?.wind?.speed;
    humidity.innertext = weatherInfo?.main?.humidity;
    cloudiness.innerText = weatherInfo?.clouds?.all;

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

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err) {
        //hW
    }
}