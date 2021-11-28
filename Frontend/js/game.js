const xhttp = new XMLHttpRequest();
const GET = 'GET';
const POST = 'POST';
const endPointRoot = 'hostedip';
const localEndPointRoot = 'http://localhost:9000'
const catAPI = 'https://thatcopy.pw/catapi/rest/';
const catURL = '/api/v1/cat';

function getCat() {
    xhttp.open(GET, localEndPointRoot + catURL, true);
    xhttp.send();
    xhttp.onreadystatechange = function() { 
        if(this.readyState == 4 && this.status == 200) { 
            console.log(this.response);
            let response = JSON.parse(this.response);
            document.getElementById('cat1').src = response.picture1URL;
            document.getElementById('cat2').src = response.picture2URL;
        }
    };
}