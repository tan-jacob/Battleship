function register() {

    let un = document.getElementById('username').value;
    let pw = document.getElementById('psw').value;
    let n = document.getElementById('name').value;

    console.log(`username ${un}, password ${pw} name ${n}`); 

    let url = `http://localhost:8888/register`;

    axios.post(url, {
        username: un,
        password: pw,
        name: n
    }).catch(function(error) {
        console.log(error);
    });
    window.location.href = `/Frontend/game.html`

}