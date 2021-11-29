axios.defaults.withCredentials = true;

const getCookieValue = (name) => (
    document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''
)

let login = async () => {
    let un = document.getElementById('username').value;
    let pw = document.getElementById('psw').value;

    console.log(`username ${un}, password ${pw}`); 

    let url = `http://localhost:8888/login`;

    axios.post(url, {
        username: un,
        password: pw,
    }, {
        withCredentials: true
    }).then(res => {
        console.log(res);
        // let response = JSON.parse(res);
        console.log(res.data);
        document.cookie = `userInfo=${JSON.stringify(res.data)}; expires=Sun, 1 Jan 2023 00:00:00 UTC; path=/`
        //testdiv.innerHTML = response;
    }).catch(function(error) {
        console.log(error);
    });
    window.location.href = `/Frontend/game.html`
    console.log(JSON.parse(getCookieValue('userInfo')));
};

    
