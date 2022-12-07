let url = "https://api.openweathermap.org/data/2.5/weather?id=5037649&APPID=eec48f1630281ec926acbcbb20931f70";
// var url = "http://api.openweathermap.org/data/2.5/weather?zip=55345,us&APPID=2ab5a5b18737e945b5af9cae2e8e1ffe";
// minnetonka city ID  5037784  Minneapolis 5037649
// api.openweathermap.org/data/2.5/weather?id=2172797
// List of city ID city.list.json.gz can be downloaded here http://bulk.openweathermap.org/sample/

// This gives a "loading" icon when data is loading
$body = $("body");

$(document).bind({
   ajaxStart: function() { $body.addClass("loading");   },
   ajaxStop:  function() { $body.removeClass("loading");}
});

function kelvinToFahrenheit(kelvin) {
  return Math.round(kelvin * (9/5) - 459.67);
}

function mpsToMph(mps) {
  return Math.round(mps/.44704);
}

function unixToTime(timestamp) {
    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
    let date = new Date(timestamp*1000);
    // Hours part from the timestamp
    let hours24 = date.getHours();
    let hoursNumber = parseInt(hours24,10);
    if (hoursNumber > 12) {hoursNumber = hoursNumber - 12;}
    let hours12 = hoursNumber.toString();
    // Minutes part from the timestamp
    let minutes = "0" + date.getMinutes();
    // Seconds part from the timestamp
    let seconds = "0" + date.getSeconds();
    // Will display time in 10:30:23 format
    let formattedTime = `${hours12}:${minutes.substr(-2)}:${seconds.substr(-2)}`;
    return formattedTime;
}

function ampm(timestamp) {
  let am = true;
  let date = new Date(timestamp*1000);
  // Hours part from the timestamp
  let hours24 = date.getHours();
  let hoursNumber = parseInt(hours24,10);
  if (hoursNumber >= 12) {am = false;}
  return am;
}

/////////////
$.ajax({

  url: url,
  success: function(result){
    console.log(result);
  if("rain" in result && !isNaN(result.rain["3h"])) {
    $("#rain").text(`Rain in the last 3 hours: ${result.rain["3h"]}`);
  }
  if("snow" in result) {
    $("#snow").text(`Snow in the last 3 hours: ${result.snow["3h"]}`);
  }

  $("#weather_place").text(result.name);

  let cloudiness = `${result.weather[0].description}, cloudiness: ${result.clouds.all}%`
  $("#weather_desc").text(cloudiness);


  let iconUrl = 'http://openweathermap.org/img/w/'+result.weather[0].icon+'.png'

  $("#weather_img_icon").attr("src", iconUrl);

  let currentTemp = kelvinToFahrenheit(result.main.temp);
  let displayTemp = `Temperature ${currentTemp}&#176;F`;
  $("#weather_tempNow").html(displayTemp);

  let windSpeed = mpsToMph(result.wind.speed)
  let displayWindSpeed = `wind ${windSpeed} mph`;
  $("#weather_wind").text(displayWindSpeed);

  let displayHumidity = `Humidity ${result.main.humidity}%`
  $("#weather_humidity").text(displayHumidity);

  let onlyTime = unixToTime(result.dt);
  let amOrPm = ampm(result.dt);
  let displayTime = ""
  if (amOrPm) {
    displayTime =   `Current time: ${onlyTime} a.m.`;
  } else {
    displayTime =   `Current time: ${onlyTime} p.m.`;
  }
  $("#weather_time").text(displayTime);

  let sunrise = unixToTime(result.sys.sunrise);
  let displaySunrise = `Sunrise: ${sunrise} a.m.`;
  $("#weather_sunrise").text(displaySunrise);

  let sunset = unixToTime(result.sys.sunset);
  let displaySunset = `Sunset: ${sunset} p.m.`;
  $("#weather_sunset").text(displaySunset);

  if (result.main.temp_max !== result.main.temp_min) {
    let highTemp = kelvinToFahrenheit(result.main.temp_max);
    let displayHigh = `High: ${highTemp}&#176;F`;
    $("#high").html(displayHigh);

    let lowTemp= kelvinToFahrenheit(result.main.temp_min);
    let displayLow = `Low: ${lowTemp}&#176;F`;
    $("#low").html(displayLow);
  }

if(!isNaN(result.visibility)) {
  let visibilityMiles = Math.round(result.visibility * .00062);
  let displayVisibility = `visibility: ${visibilityMiles} miles`;
  $("#visibility").text(displayVisibility);
}
}
});
