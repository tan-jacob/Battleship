function post() {
    let testdiv = document.getElementById('res');

    let pID = document.getElementById('pictureid').value;
    let uID = document.getElementById('userid').value;
    let com = document.getElementById('comment').value;

    console.log("pid: " + pID + " uid: " + uID + " com: " + com); 

    let url = `http://localhost:9000/comments/${pID}`;

    axios.post(url, {
        userID: uID,
        pictureID: pID,
        comment: com
    }).then(res => {
        let response = JSON.parse(res);
        testdiv.innerHTML = response;
    }).catch(function(error) {
        console.log(error);
      });
}

function put() {
    let testdiv = document.getElementById('res');

    let comID = document.getElementById('comid').value;
    let com = document.getElementById('comment').value;

    console.log("comid: " + comID + " com: " + com); 

    let url = `http://localhost:9000/comments/${cID}`;

    axios.put(url, {
        comment: com
    }).then(res => {
        let response = JSON.parse(res);
        testdiv.innerHTML = response;
    }).catch(function(error) {
        console.log(error);
      });
}

function get() {
    let testdiv = document.getElementById('res');

    let pID = document.getElementById('pictureid').value;
    console.log(pID);
    let url = `http://localhost:9000/comments/${pID}`;

    axios.get(url).then(res => {
        console.log(res.data);
    }).catch(function(error) {
        console.log(error);
      });
}