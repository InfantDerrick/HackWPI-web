firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      if(user.displayName == null){
        window.open('./startup.html', '_self');
      }
      // firebase.database().ref('users').once('value', function(snapshot){
      //   if(!snapshot.hasChild(user.displayName)){
      //     var x = user.displayName;
      //     firebase.database().ref('users').set({
      //       "sdas": "fuck"
      //     });
      //   }
      // })
      console.log("success");
      var displayName = firebase.auth().currentUser.displayName;
      firebase.database().ref('users/'+displayName+'/').child('deviceNumber').once('value', function(snapshot){
        console.log(snapshot.val());
        firebase.database().ref('devices/'+snapshot.val()+'/').child('temperature_goal').once('value', function(snapshot){
          document.getElementById('goalTemp').innerHTML = snapshot.value();
        });
        firebase.database().ref('devices/'+snapshot.val()+'/').child('temperature').once('value', function(snapshot){
          document.getElementById('currentTemp').innerHTML = snapshot.value();
        });
        document.getElementById('goalPercent').innerHTML = (parseFloat(document.getElementById('currentTemp').innerHTML).innerHTML)/parseFloat(document.getElementById('goalTemp')).toFixed(2);
          document.getElementById('goalProgressBar').style.width = (parseFloat(document.getElementById('currentTemp').innerHTML).innerHTML)/parseFloat(document.getElementById('goalTemp')).toFixed(2)+"%";

      });

    } else {
      window.open('./login.html', '_self');
    }
  });
(function ($) {
  'use strict';

  var weatherApiCall = 'https://api.openweathermap.org/data/2.5/forecast?q=Acton,us&APPID=e551d8da3b849d6e3ecc88ffa2ac5cca';

  $.getJSON(weatherApiCall, weatherCallBack);

  function weatherCallBack(weatherData) {
    console.log(weatherData);
    var cityName = weatherData.city.name;
    var country = weatherData.city.country;
    var weatherDetails = weatherData.list;
    console.log(weatherDetails);
    var weekday = new Array(7);
    weekday[0] =  "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";
    var month = new Array(12);
    month[0] = "January";
    month[1] = "February";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "August";
    month[8] = "September";
    month[9] = "October";
    month[10] = "November";
    month[11] = "December";
    for(var i = 0; i < 8; i++){
      if(i == 0){
        document.getElementById("day").innerHTML = weekday[epochConverter(weatherDetails[i].dt).getDay()];
        document.getElementsByClassName("weather-date")[0].innerHTML = month[epochConverter(weatherDetails[i].dt).getMonth()] + " " + epochConverter(weatherDetails[i].dt).getDate() +", " + epochConverter(weatherDetails[i].dt).getUTCFullYear() + "</br>";
        document.getElementsByClassName("weather-location")[0].innerHTML = cityName + ", " + country;
        document.getElementsByClassName("weather-val")[0].innerHTML = kelvinToFaren(weatherDetails[i].main.temp).toFixed(2) + '<span class="symbol">&deg;</span>F';
        document.getElementById("mainWeatherDescription").innerHTML = weatherDetails[i].weather[0].main;
      }else {
        document.getElementsByClassName("time-val")[i-1].innerHTML = epochConverter(weatherDetails[i].dt).getUTCHours()+":00";
        document.getElementsByClassName("weather-val")[i].innerHTML = kelvinToFaren(weatherDetails[i].main.temp).toFixed(2)+"°";
        var icon = "";
        if(weatherDetails[i].weather[0].main == "Snow"){
          icon = "mdi-snowflake";
        }else if(weatherDetails[i].weather[0].main = "Clear"){
          icon = "mdi-weather-sunny";
        }else if(weatherDetails[i].weather[0].main = "Clouds"){
          icon = "mdi-weather-cloudy"
        }
        document.getElementsByClassName("weatherIcon")[i-1].classList.add(icon);
      }
    }
  }
  //e551d8da3b849d6e3ecc88ffa2ac5cca
  $(function () {
    if ($('#dashboard-area-chart').length) {
      var lineChartCanvas = $("#dashboard-area-chart").get(0).getContext("2d");
      var data = {
        labels: ["2013", "2014", "2014", "2015", "2016", "2017"],
        datasets: [{
            label: 'Product',
            data: [0, 11, 6, 10, 8, 0],
            backgroundColor: 'rgba(0, 128, 207, 0.4)',
            borderWidth: 1,
            fill: true
          },
          {
            label: 'Product',
            data: [0, 7, 11, 8, 11, 0],
            backgroundColor: 'rgba(2, 178, 248, 0.4)',
            borderWidth: 1,
            fill: true
          },
          {
            label: 'Support',
            data: [0, 14, 10, 14, 6, 0],
            backgroundColor: 'rgba(73, 221, 255, 0.4)',
            borderWidth: 1,
            fill: true
          }
        ]
      };
      var options = {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          yAxes: [{
            display: false
          }],
          xAxes: [{
            display: false,
            ticks: {
              beginAtZero: true
            }
          }]
        },
        legend: {
          display: false
        },
        elements: {
          point: {
            radius: 3
          }
        },
        layout: {
          padding: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
          }
        },
        stepsize: 1
      };
      var lineChart = new Chart(lineChartCanvas, {
        type: 'line',
        data: data,
        options: options
      });
    }
  });
})(jQuery);
function epochConverter(epochTime){
  var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
  d.setUTCSeconds(epochTime);
  return d;
}
function kelvinToFaren(kelvin){
  return ((kelvin-273.15)*1.8)+32
}
function signOut(){
  firebase.auth().signOut().then(function() {
    window.open('./index.html', '_self');
  }).catch(function(error) {
    window.alert("Error: " + error);
  });
}
