var currentOutsideTemp = 0;
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
      firebase.database().ref('users/'+displayName+'/').child('deviceNumber').on('value', function(snapshot){
        console.log(snapshot.val());
        var goal = 0;
        var current = 0;
        firebase.database().ref('devices/'+snapshot.val()+'/').child('temperature_goal').on('value', function(snap){
          document.getElementById('goalTemp').innerHTML = snap.val();
          goal = snap.val();
              document.getElementById('efficiency-level').innerHTML = currentOutsideTemp>snap.val()?((snap.val()/currentOutsideTemp)*100).toFixed(2):((currentOutsideTemp/snap.val())*100).toFixed(2)+"%";
              document.getElementById('efficienyProgressBar').style.width = currentOutsideTemp>snap.val()?((snap.val()/currentOutsideTemp)*100).toFixed(2):((currentOutsideTemp/snap.val())*100).toFixed(2)+"%";
        });
        firebase.database().ref('devices/'+snapshot.val()+'/').child('humidity').on('value', function(snap){
          document.getElementById('mainTemp').innerHTML = snap.val();
        });
        firebase.database().ref('devices/'+snapshot.val()+'/').child('temperature').on('value', function(snap){
          document.getElementById('currentTemp').innerHTML = snap.val();
          current = snap.val();
          console.log(current/goal);
          if(current > goal){
            document.getElementById('goalPercent').innerHTML = ((goal/current)*(100)).toFixed(2) + "%";
              document.getElementById('goalProgressBar').style.width = ((goal/current)*(100)).toFixed(2)+"%";
          }else{
          document.getElementById('goalPercent').innerHTML = ((current/goal)*(100)).toFixed(2) + "%";
            document.getElementById('goalProgressBar').style.width = ((current/goal)*(100)).toFixed(2)+"%";
          }
        });
        firebase.database().ref('devices/'+snapshot.val()+'/').child('lightstate').on('value', function(snap){
          console.log(snap.val());
          if(snap.val()){
            document.getElementById('lightBulb').classList.add('mdi-lightbulb-on');
            document.getElementById('lightState').innerHTML = "ON";
          }else{
            document.getElementById('lightState').innerHTML = "OFF";
          }
        });
        firebase.database().ref('devices/'+snapshot.val()+'/').child('doorstate').on('value', function(snap){
          console.log(snap.val());
          if(snap.val()){
            document.getElementById('doorstate').innerHTML = "OPEN";
            document.getElementById('doorIcon').classList.add('mdi-door-open');
          }else{
            document.getElementById('doorstate').innerHTML = "CLOSED";
          }
        });
        firebase.database().ref('devices/'+snapshot.val()+'/').child('garageState').on('value', function(snap){
          if(snap.val()){
            $("#garageState").text("OPEN");
            console.log("OPEN");
          }else {
            $("#garageState").text("CLOSED");
            console.log("CLOSED");
          }
        });
        firebase.database().ref('devices/'+snapshot.val()+'/').child('lockstate').on('value', function(snap){
          console.log(snap.val());
          if(snap.val()){
            document.getElementById('lockstate').innerHTML = '<i class="mdi mdi-lock e mr-1" aria-hidden="true"></i>LOCKED';
          }else{
            document.getElementById('lockstate').innerHTML = '<i class="mdi mdi-lock e mr-1" aria-hidden="true"></i>UNLOCKED';
          }
        });
        firebase.database().ref('devices/'+snapshot.val()+'/').child('temp_logs').limitToLast(6).on('value', function(snap){
          var i = 1
          document.getElementById("logBody").innerHTML = "";
          snap.forEach(function(str){
          var parse = str.val().parse;
          var ind = parse.split(";");

            var doc = "";
            var changeString = "";
            var percent;
            var change = goal-ind[0]
            if(ind[0]>goal){
                percent = goal/ind[0];
            }else{
                percent = ind[0]/goal;
            }
            if(change<0){
              changeString = '</td><td class="text-danger">' + -change.toFixed(2)+'<i class="mdi mdi-arrow-down"></i>'
            }else{
              changeString = '</td><td class="text-success">' + change.toFixed(2)+'<i class="mdi mdi-arrow-up"></i>'
            }

          doc = '<tr><td class="font-weight-medium">'+i+'</td><td>'+ind[1]+'</td><td>'+'<div class="progress">'+
            '<div class="progress-bar bg-danger progress-bar-striped" role="progressbar" style="width: '+percent*100+'%" aria-valuenow="'+percent*100+'" aria-valuemin="0"'+
              'aria-valuemax="100"></div>' +
          '</div>'+'</td><td>'+ind[0]+changeString+
          '</td></tr>';
          i++;
          console.log(doc);
          document.getElementById("logBody").innerHTML += doc;

        });
        });
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
        currentOutsideTemp = kelvinToFaren(weatherDetails[i].main.temp).toFixed(2);
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
function lightToggle(){
  var displayName = firebase.auth().currentUser.displayName;
  firebase.database().ref('users/'+displayName+'/').child('deviceNumber').once('value', function(snapshot){
    firebase.database().ref('devices/'+snapshot.val()+'/').child('lightstate').once('value', function(snap){
      if(snap.val()){
        firebase.database().ref('devices/'+snapshot.val()+'/').child('lightstate').set(false);
      }else{
        firebase.database().ref('devices/'+snapshot.val()+'/').child('lightstate').set(true);
      }
      location.reload();
    });
  });
}
function lockToggle(){
  var displayName = firebase.auth().currentUser.displayName;
  firebase.database().ref('users/'+displayName+'/').child('deviceNumber').once('value', function(snapshot){
    firebase.database().ref('devices/'+snapshot.val()+'/').child('lockstate').once('value', function(snap){
      if(snap.val()){
        firebase.database().ref('devices/'+snapshot.val()+'/').child('lockstate').set(false);
      }else{
        firebase.database().ref('devices/'+snapshot.val()+'/').child('lockstate').set(true);
      }
      location.reload();
    });
  });
}
function increaseTemperatureGoalByOne(){
  var displayName = firebase.auth().currentUser.displayName;
  firebase.database().ref('users/'+displayName+'/').child('deviceNumber').once('value', function(snapshot){
    firebase.database().ref('devices/'+snapshot.val()+'/').child('temperature_goal').once('value', function(snap){
      firebase.database().ref('devices/'+snapshot.val()+'/').child('temperature_goal').set(snap.val() + 1);
    });
});
}
function decreaseTemperatureGoalByOne(){
  var displayName = firebase.auth().currentUser.displayName;
  firebase.database().ref('users/'+displayName+'/').child('deviceNumber').once('value', function(snapshot){
    firebase.database().ref('devices/'+snapshot.val()+'/').child('temperature_goal').once('value', function(snap){
      firebase.database().ref('devices/'+snapshot.val()+'/').child('temperature_goal').set(snap.val() - 1);
    });

});
}
