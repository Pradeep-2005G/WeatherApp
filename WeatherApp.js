const apiKey = "2ae5efa386728985462b5c38af74ca5c";
const card = document.getElementById("weatherCard");
const errorBox = document.getElementById("errorBox");
const forecastBox = document.getElementById("forecast");

const cityNameEl = document.getElementById("cityName");
const tempEl = document.getElementById("temp");
const humidityEl = document.getElementById("humidity");
const conditionEl = document.getElementById("condition");
const iconEl = document.getElementById("icon");

searchBtn.addEventListener("click", ()=>{
    const city = cityInput.value.trim();
    if(city) fetchByCity(city);
});

locBtn.addEventListener("click", getLocationWeather);

function fetchByCity(city){
    showLoader();
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
    .then(r=>r.json()).then(data=>{
        if(data.cod!=200){showError("City not found");return;}
        showWeather(data);
        fetchForecast(data.coord.lat,data.coord.lon);
    });
}

function getLocationWeather(){
    if(!navigator.geolocation){showError("Geolocation not supported");return;}
    showLoader();
    navigator.geolocation.getCurrentPosition(pos=>{
        const {latitude,longitude}=pos.coords;
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`)
        .then(r=>r.json()).then(data=>{
            showWeather(data);
            fetchForecast(latitude,longitude);
        });
    },()=>showError("Location denied"));
}

function fetchForecast(lat,lon){
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
    .then(r=>r.json()).then(data=>{
        forecastBox.innerHTML="";
        for(let i=0;i<data.list.length;i+=8){
            const d=data.list[i];
            const div=document.createElement("div");
            div.className="forecast-card";
            div.innerHTML=`<p>${new Date(d.dt_txt).toDateString().slice(0,3)}</p><img src="https://openweathermap.org/img/wn/${d.weather[0].icon}.png"><p>${Math.round(d.main.temp)}°C</p>`;
            forecastBox.appendChild(div);
        }
    });
}

function showLoader(){
    loader.classList.remove("hidden");
    card.classList.add("hidden");
    errorBox.classList.add("hidden");
}

function showWeather(data){
    loader.classList.add("hidden");
    card.classList.remove("hidden");
    errorBox.classList.add("hidden");

    cityNameEl.innerText=data.name;
    tempEl.innerText=Math.round(data.main.temp)+" °C";
    humidityEl.innerText="Humidity: "+data.main.humidity+"%";
    conditionEl.innerText=data.weather[0].main;
    iconEl.src=`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
}

function showError(msg){
    loader.classList.add("hidden");
    card.classList.add("hidden");
    errorBox.classList.remove("hidden");
    errorBox.innerText=msg;
}