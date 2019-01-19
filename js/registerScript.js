firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log(user.email);
      window.open('./login.html', '_self');
    }
  });
function register(){
  username = document.getElementById("username").value;
  password1 = document.getElementById("password1").value;
  password2 = document.getElementById("password2").value;
  if(password1 != password2){
    window.alert("The passwords do not match");
  }else{
    firebase.auth().createUserWithEmailAndPassword(username, password1).catch(function(error) {

    var errorCode = error.code;
    var errorMessage = error.message;
    window.alert(error);
  });
}
}
