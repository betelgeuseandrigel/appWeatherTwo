const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");
const currentWeatherEl = document.getElementById("current-weather-items");
const timeZone = document.getElementById("time-zone");
const country = document.getElementById("country");
const weatherForecastEl = document.getElementById("weather-forecast");
const currentTempEl = document.getElementById("current-temp");
const nameCity = document.querySelector(".name");

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Agu", "Sep", "Oct", "Nov", "Dec"];



setInterval(() =>{
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    let hour = time.getHours();
    let hourIn12HrsFormat = hour >=12 ?  hour % 12 : hour;
    let minutes = time.getMinutes();
    const amPm = hour >= 12 ? "PM" : "AM";


    hourIn12HrsFormat = digitoCero(hourIn12HrsFormat);
    minutes = digitoCero(minutes);
    
    function digitoCero(digito){
        digito = digito.toString();
        return digito.length < 2 ? "0" + digito : digito;
    }

    timeEl.innerHTML = hourIn12HrsFormat + ":" + minutes + `<span class="" id="am-pm">${amPm}</span>`;
    dateEl.innerHTML = days[day] + ", " + date + " " + months[month];

}, 1000);




const apiKey = '73106aedfa4c333225792873f2368773';
const apiUrl ='https://api.openweathermap.org/data/2.5/weather?units=metric&q=';
const apiUrlDos = 'https://api.openweathermap.org/data/2.5/forecast?&units=metric&cnt=5'

const searchBox = document.querySelector(".input1");
const searchBtn = document.querySelector(".btn");
const weatherIcon = document.querySelector(".w-icon");



async function checkWeather(city){
    const response = await fetch(apiUrl  + city + `&appid=${apiKey}`);

    if(response.status == 404){
        document.querySelector(".error").style.display = "block";
        document.querySelector(".date-container").style.display = "none";
        document.querySelector(".description").style.display = "none";
        document.querySelector(".future-forecast").style.display = "none";
        
    } else {
        let data = await response.json();

        console.log(data);

        let {humidity, pressure} = data.main;
        let {speed} = data.wind;
        let {sunrise, sunset} = data.sys;

        currentWeatherEl.innerHTML = `
        <div class="weather-item">
            <div>Humidity</div>
            <div>${humidity}</div>
        </div>
        <div class="weather-item">
            <div>Pressure</div>
            <div>${pressure}</div>
        </div>
        <div class="weather-item">
            <div>Wind speed</div>
            <div>${speed}</div>
        </div>
        <div class="weather-item">
            <div>Sunrise</div>
            <div>${window.moment(sunrise * 1000).format('HH:mm a')}</div>
        </div>
        <div class="weather-item">
            <div>Sunset</div>
            <div>${window.moment(sunset * 1000).format('HH:mm a')}</div>
        </div>`

        
        currentTempEl.innerHTML = `
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png" alt="weather icon" class="w-icon">
        <div class="other">
            <div class="day">${window.moment(data.dt * 1000).format('dddd')}</div>
            <div class="temp">Temp - ${Math.round(data.main.temp)}&#176; C</div>
            <div class="temp">Fls-like - ${Math.round(data.main.feels_like)}&#176; C</div>
        </div>`

    
       //Convert country code to name
       function convertCountryCode(country){
        let regionNames = new Intl.DisplayNames(["en"], {type: "region"});
        return regionNames.of(country)
        }


       timeZone.innerHTML = `${convertCountryCode(data.sys.country)}`;
       country.innerHTML = data.coord.lat + "N" + data.coord.lon + "E";
       nameCity.innerHTML = `${data.name}`;

    
        twoWeatherData();
        async function twoWeatherData(){
        let {lat, lon} = data.coord;
        const res = await fetch(apiUrlDos + `&lat=${lat}` + `&lon=${lon}` + `&appid=${apiKey}`);
        let info = await res.json();
        console.log(info);
        twoShowWeatherData(info); 
        } 
        


        function twoShowWeatherData(info){
   
        let otherDayForecast = '';
        info.list.forEach((clima, idx)=>{
        if(idx == 0){
            otherDayForecast += `
            <div class="weather-forecast-item">
                <div class="day">${window.moment(clima.dt * 1000).format('HH:mm a')}</div>
                <img src="https://openweathermap.org/img/wn/${clima.weather[0].icon}@2x.png" alt="weather icon" class="w-icon"> 
                <div class="temp">Temp - ${Math.round(clima.main.temp)}&#176; C</div>
                <div class="temp">Fls-like - ${Math.round(clima.main.feels_like)}&#176; C</div>
            </div>`
        }  else{
            otherDayForecast += `
            <div class="weather-forecast-item">
                <div class="day">${window.moment(clima.dt * 1000).format('HH:mm a')}</div>
                <img src="https://openweathermap.org/img/wn/${clima.weather[0].icon}@2x.png" alt="weather icon" class="w-icon"> 
                <div class="temp">Temp - ${Math.round(clima.main.temp)}&#176; C</div>
                <div class="temp">Fls-like - ${Math.round(clima.main.feels_like)}&#176; C</div>
            </div>`
        }       
        })

        weatherForecastEl.innerHTML = otherDayForecast;
    
    }

        document.querySelector(".error").style.display = "none";
        document.querySelector(".date-container").style.display = "block";
        document.querySelector(".description").style.display = "block";
        document.querySelector(".future-forecast").style.display = "flex";
}}


searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value);
});
