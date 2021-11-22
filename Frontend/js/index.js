function postUser() {
    let testdiv = document.getElementById('testdiv');

    let url = 'http://localhost:8000/API/V1/user';

    axios.post(url, {
        name: "jane doe",
        username: 'hello',
        password: 'testse'
    }).then(res => {
        let response = JSON.parse(res);
        testdiv.innerHTML = response.name;
    });
}

function getUser() {
    let userid = document.getElementById('userid').value;

    let url = `http://localhost:8000/API/v1/user/` + userid;
    console.log(url);
    axios.get(url, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((res) => {
        //let response = JSON.parse(res);
        document.getElementById('user').innerHTML = "name: " + res.data[0].name;
        console.log(res.data[0]);
    }).catch(err => {
        if (err.response) {
            document.getElementById('user').innerHTML = "User not found!";
        }
    });
}

function login() {
    let username = document.getElementById('username');
    let password = document.getElementById('password');

    if ((username.value == "admin") && (password.value == "1234abcd")) {
        document.getElementById('logindiv').style.display = 'none';
        document.getElementById('datadiv').style.display = "block";
    }   
}

function getData() {
    let url = 'http://localhost:8000/API/v1/admin';
    axios.get(url, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((res) => {
        //let response = JSON.parse(res);
        document.getElementById('counterGetUser').innerHTML = res.data.get;
        document.getElementById('counterPostUser').innerHTML = res.data.post;
        console.log(res.data);
    });
}


//window.onload = getData;