const search = document.querySelector(".search button");

search.addEventListener("click", () => {
  const city = document.querySelector(".search input").value;

  if (city === '') return;

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=98740f4ebc0d63bc0f8ba70090e5a091&units=metric`)
    .then(response => response.json())
    .then(data => {
      const img = document.querySelector(".wetherbox img");
      const temp = document.querySelector(".wetherbox .temp");
      const description = document.querySelector(".wetherbox .description");
      const humi = document.querySelector(".details .humi span");
      const wind = document.querySelector(".details .wind span");
      const body = document.querySelector(".bg");
    console.log(" data li wslok : ", data);
      

      switch (data.weather[0].main) {
        case 'Clear':
          img.src = 'assist/clear.png';
          body.style.backgroundImage = "url('assist/clear.jpg')";
          break;
        case 'Rain':
          img.src = 'assist/rain.png';
          body.style.backgroundImage = "url('assist/rian.gif')";
          break;
        case 'Snow':
          img.src = 'assist/snow.png';
          body.style.backgroundImage = "url('assist/snow.gif')";
          break;
        case 'Clouds':
          img.src = 'assist/cloud.png';
          body.style.backgroundImage = "url('assist/cloud.gif')";
          break;
        case 'Mist':
        case 'Haze':
          img.src = 'assist/mist.png';
          body.style.backgroundImage = "url('assist/mist.gif')";
          break;
        default:
          img.src = 'assist/cloud.png';
          body.style.backgroundImage = "url('assist/cloud.gif')";
      }
      input.value = "";

      temp.innerHTML = data.main.temp + "<span>°C</span>";
      description.innerHTML = data.weather[0].description;
      humi.innerHTML = data.main.humidity + "%";
      wind.innerHTML = data.wind.speed + "km/h";
    })
    .catch(() => {
      alert("makaynaxi had city...");
    });
});
const input = document.querySelector(".search input");

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    search.click();
  }
});

