axios.defaults.withCredentials = true;

let login = async () => {
    let un = document.getElementById('username').value;
    let pw = document.getElementById('password').value;

    console.log(`username ${un}, password ${pw}`); 

    let url = `https://inyoungkang.me/adminlogin`;

    await axios.post(url, {
        username: un,
        password: pw,
        apikey: 'myadminkey'
    }, {
        withCredentials: true
    }).then(res => {
        console.log(res);
        // let response = JSON.parse(res);
        console.log(res.data);
        if (res.data.isAdmin) {
            document.getElementById('logindiv').style.display = 'none';
            document.getElementById('endpointDivs').style.display = "block";
            getResource();
        }

        //testdiv.innerHTML = response;
    }).catch(function(error) {
        console.log(error);
    });
    console.log(JSON.parse(getCookieValue('cookie1')));
};

let getResource = () => {
    let url = `https://inyoungkang.me/resource/myadminkey`;

    axios.get(url)
    .then(res => {
        // let response = JSON.parse(res);
        console.log(res.data);
        let table = document.getElementById('maintable');

        res.data.forEach(element => {
            let tr = document.createElement('tr');

            let tdMethod = document.createElement('td');
            tdMethod.innerHTML = element.method;

            let tdEndpoint = document.createElement('td');
            tdEndpoint.innerHTML = element.uri;

            let tdRequest = document.createElement('td');
            tdRequest.innerHTML = element.stat;

            tr.appendChild(tdMethod);
            tr.appendChild(tdEndpoint);
            tr.appendChild(tdRequest);

            table.appendChild(tr);
        });
   
    }).catch(function(error) {
        console.log(error);
    });
}

//window.onload(getResource());