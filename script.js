let searchButton = document.querySelector("#search-button");
let currentWeather = document.querySelector("#first-child-container");
let forecastContainer = document.querySelector("#forcastcontainer");
let cityname = document.querySelector("#city-name");
let getUserLocation = document.querySelector("#userlocation");
let citynametex = document.querySelector("#citynametex");
let currentWeatherChange = document.querySelector("#weather-change");
let forcastcontainer = document.querySelector("#forcastcontainer");
// first we have to fetch data from the api we used
async function fetchApi(url) {
  try {
    let fetchApi = await fetch(url);
    let fetchApiJson = await fetchApi.json();
    let fetchApiData = await fetchApiJson;
    saveToLocalstorage(url);
    return fetchApiJson;
  } catch (error) {
    console.log(error);
  }
}
//fetched the weather api successfully

searchButton.addEventListener("click", async function getData() {
  if (cityname.value == "") {
    alert("enter the city name please");
  } else {
    let fetchkey = `https://api.weatherapi.com/v1/forecast.json?q=${cityname.value}&days=5&key=df7058e6881d4a1ca13155224242707`;
    let waitdata1 = await fetchApi(fetchkey);
    console.log(waitdata1);
    displayData(waitdata1);
  }
});

getUserLocation.addEventListener("click", function () {
  async function getdata() {
    navigator.geolocation.getCurrentPosition(
      async (success) => {
        let fetchkey = `https://api.weatherapi.com/v1/forecast.json?q=${success.coords.longitude},${success.coords.latitude}&days=5&key=df7058e6881d4a1ca13155224242707`;
        let waitdata = await fetchApi(fetchkey);
        console.log(waitdata);
        displayData(waitdata);
      },
      (error) => {
        console.log(error);
      }
    );
  }
  getdata();
});

function displayData(data) {
  currentWeather.innerHTML = "";
  currentWeather.innerHTML = `
                <div class ="flex flex-col justify-around ">
                  <p class="text-3xl "><span class="citynametex ">${data.location.name}</span><span>:</span>(${data.location.localtime})</p>
                  <p class="text-2xl"><span>Temperature: </span><span>:</span><span>${data.current.temp_c}</span></p>
                  <p class="text-2xl"><span>Wind: </span><span>${data.current.wind_kph} M/S</span></p>
                  <p class="text-2xl"><span>Humidity: </span><span>:</span> <span>${data.current.humidity}%</span></p>
                  </div>
                  <div class="flex justify-center flex-col-reverse mr-20">
                  <img src="${data.current.condition.icon}" width="150px" alt="weather" class="mb-2">
                  <span class="text-center text-5xl">weather</span>
                </div>
                  `;

  forecastContainer.innerHTML = ""; // Clear previous forecast data

  data.forecast.forecastday.forEach((day) => {
    forcastcontainer.innerHTML += `
                <div id="forcast-child-container-1">
                <h2 class="text-5xl text-center ">${day.date}</h2>
                <div
                    class="mt-2 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-slate-600 duration-300 ... border-8 rounded-lg bg-slate-400 hover:bg-slate-500">
                    <div>
                        <img src=${day.day.condition.icon} width="50px" alt="">
                    </div>
                    <p class="text-2xl"><span>Temperature</span> <span>:</span>${day.day.maxtemp_f}</p>
                    <p class="text-2xl"><span>Wind</span> <span>:</span> <span>${day.day.maxwind_mph} M/S</span></p>
                    <p class="text-2xl"><span>Humidity</span> <span>:</span> <span>${day.day.avghumidity}%</span></p>
                </div>
        `;
  });

  displaydropdowncontainer () 

}

async function saveToLocalstorage(url) {
  let getthedata = JSON.parse(localStorage.getItem("weather")) || [];
  let fetchData = await fetch(url);
  let convertedToJson = await fetchData.json();
  let cityexits = convertedToJson.location.name;
  let newData = getthedata.some((item) => item.location.name === cityexits);

  if (!newData) {
    getthedata.push(convertedToJson);
    localStorage.setItem("weather", JSON.stringify(getthedata));
  } else {
    return;
  }
}
   function displaydropdowncontainer () {
  let cities = JSON.parse(localStorage.getItem("weather"))

  let dropcontainer = document.querySelector("#dropdown-container")
    
}

