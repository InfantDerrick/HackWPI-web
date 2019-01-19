function setUp(){
  var user = firebase.auth().currentUser;
  console.log("hey there");
if (user && user.displayName == null ) {
  var displayName = document.getElementById('displayName').value;
  var imgUrl = document.getElementById('imgUrl').value;
  var deviceNumber = parseInt(document.getElementById('deviceNumber').value);
  console.log(displayName);
  firebase.auth().currentUser.updateProfile({
    displayName: displayName,
    photoURL: imgUrl
  }).then(function updateData() {
    window.open('./login.html', '_self');
}).catch(function(error){
  console.log(error);
});
} else {
}
}
