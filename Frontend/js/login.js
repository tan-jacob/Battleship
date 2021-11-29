function login() {
    let un = document.getElementById('username').value;
    let pw = document.getElementById('psw').value;

    console.log(`username ${un}, password ${pw}`); 

    let url = `http://localhost:8888/login`;

    axios.post(url, {
        username: un,
        password: pw,
    }).catch(function(error) {
        console.log(error);
    });
}