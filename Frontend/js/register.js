function register() {

    let un = document.getElementById('username').value.trim();
    let pw = document.getElementById('psw').value.trim();
    let n = document.getElementById('name').value.trim();

    console.log(`username ${un}, password ${pw} name ${n}`); 

    if (un == null || un == "", pw == null || pw == "", n == null || n == ""){
        alert("Don't leave any values empty!");
        return false;
      }

    let url = `http://localhost:8888/register`;

    axios.post(url, {
        username: un,
        password: pw,
        name: n
    }).catch(function(error) {
        console.log(error);
    });
}