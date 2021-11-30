axios.defaults.withCredentials = true;

const getCookieValue = (name) => (
    document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''
)

let login = async () => {
    let un = document.getElementById('username').value;
    let pw = document.getElementById('psw').value;

    //console.log(`username ${un}, password ${pw}`); 

    let url = `https://inyoungkang.me/login`;

    axios.post(url, {
        username: un,
        password: pw,
        apikey: 'catorcatappapikey'
    }, {
        withCredentials: true
    }).then(res => {
       // console.log(res);
        // let response = JSON.parse(res);
       // console.log(res.data);
        document.cookie = `cookie1=${JSON.stringify(res.data)}; expires=Sun, 1 Jan 2023 00:00:00 UTC; path=/`;
        //testdiv.innerHTML = response;
    }).catch(function(error) {
        console.log(error);
    });
    //console.log(JSON.parse(getCookieValue('cookie1')));
    alert("Logged in!");
};

    
