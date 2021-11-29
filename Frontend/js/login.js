axios.defaults.withCredentials = true;

let login = async () => {
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

    // try {
    //     let resp = await axios.post(url, {
    //         username: un,
    //         pasword: pw
    //     });
        
    //     console.log(resp.data);
        
    //     // , {withCredentials: true}
    //     //const token = await resp.data.json();
    
    //     //set token in cookie
    //     //document.cookie = `token=${token}`;
    // } catch (err) {
    //     // Handle Error Here
    //     console.error(err);
    // }
};

    
