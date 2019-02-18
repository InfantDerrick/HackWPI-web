firebase.database().ref('devices/913/').child('distance').on('value', function(snap){
  document.getElementById("distance").innerHTML = snap.val();
})
