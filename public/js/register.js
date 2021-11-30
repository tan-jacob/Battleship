function register() {

    let un = document.getElementById('username').value.trim();
    let pw = document.getElementById('psw').value.trim();
    let n = document.getElementById('name').value.trim();


    if (un == null || un == "", pw == null || pw == "", n == null || n == ""){
        alert("Don't leave any values empty!");
        return false;
      }


    let url = `https://inyoungkang.me/register`;

    axios.post(url, {
        username: un,
        password: pw,
        name: n,
        apikey: 'catorcatappapikey'
    }).catch(function(error) {
        console.log(error);
    });
    //window.location.href = `/Frontend/game.html`
    alert("Registered!")
}