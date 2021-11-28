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

let getCat = async() => {
    const response = await axios.get(localEndPointRoot + catURL);
    console.log(response);
    cat1.src = response.data.picture1URL;
    cat1.dataset.catid = response.data.picture1ID;
    cat2.src = response.data.picture2URL;
    cat2.dataset.catid = response.data.picture2ID;
    b1.onclick = function () {vote(response.data.picture1ID);};
    b2.onclick = function () {vote(response.data.picture2ID);};

    return response;
}

let vote = (num) => {
    console.log("vote for cat", num);
    getCat()
    
}
