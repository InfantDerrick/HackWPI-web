firebase.auth().onAuthStateChanged(function(user) {
    if (user && user.displayName == null) {
      var displayName = document.getElementById('displayName').value;
      var imgUrl = document.getElementById('imgUrl').value;
      var deviceNumber = parseInt(document.getElementById('deviceNumber').value);
      user.updateProfile({
        displayName: displayName,
        photoURL: imgUrl
      }).then(function updateData() {
        firebase.database().ref('users').set({
          displayName: {
            "deviceNumber": deviceNumber
          }
        });
        window.open('./login.html', '_self');
    });
  }else{
      window.open('./login.html', '_self');
    }
  });
