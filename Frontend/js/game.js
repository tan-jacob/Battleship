const xhttp = new XMLHttpRequest();
const GET = 'GET';
const POST = 'POST';
const endPointRoot = 'hostedip';
const localEndPointRoot = 'http://localhost:8888'
const catAPI = 'https://thatcopy.pw/catapi/rest/';
const catURL = '/api/v1/cat';

let cat1 = document.getElementById('cat1');
let cat2 = document.getElementById('cat2');
let b1 = document.getElementById('btn1');
let b2 = document.getElementById('btn2');
let c1 = document.getElementById('comm1');
let c2 = document.getElementById('comm2');

/*
let getCat = () => {
    xhttp.open(GET, localEndPointRoot + catURL, true);
    xhttp.send();
    xhttp.onreadystatechange = function() { 
        if(this.readyState == 4 && this.status == 200) { 
            console.log(this.response);
            let response = JSON.parse(this.response);

            document.getElementById('cat1').src = response.picture1URL;
            document.getElementById('btn1').onclick = function () {
                vote(response.picture1ID);
                return false;
            };

            document.getElementById('cat2').src = response.picture2URL;
            document.getElementById('btn2').onclick = function () {
                vote(response.picture2ID);
                return false;
            };
        }
    };
}
*/
let getCat = async() => {
    const response = await axios.get(localEndPointRoot + catURL);
    console.log(response);
    cat1.src = response.data.picture1URL;
    cat1.dataset.catid = response.data.picture1ID;
    cat2.src = response.data.picture2URL;
    cat2.dataset.catid = response.data.picture2ID;
    b1.onclick = function () {vote(response.data.picture1ID);};
    b2.onclick = function () {vote(response.data.picture2ID);};
    c1.onclick = function () {comment(response.data.picture1ID);};
    c2.onclick = function () { comment(response.data.picture2ID);};

    return response;
}

let getComments = (id) => {
    const response = await axios.get(localEndPointRoot + '/comments/' + id, )
}

let vote = (num) => {
    console.log("vote for cat", num);
    getCat()
    
}

let comment = (id) =>
{
    console.log("comment on", id);
    let comment = document.getElementById("")
    const response = await axios.put(localEndPointRoot + '/comments/' + id, )
    
}