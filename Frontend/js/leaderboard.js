//this will be how the leaderboard is generated
const xhttp = new XMLHttpRequest();
//const { default: axios } = require("axios");
const GET = 'GET';
const POST = 'POST';

const localEndPointRoot = 'http://localhost:8888'
const resource = '/api/v1';
const url = localEndPointRoot + resource;
const lboardurl = '/leaderboard/'
const catURL = '/api/v1/cat';

 showLeaderboard = () => {
    xhttp.open(GET, localEndPointRoot + lboardurl +"10", true);
    xhttp.send();
    xhttp.onreadystatechange = function() { 
        if(this.readyState == 4 && this.status == 200) { 
            let response = JSON.parse(this.response);
            let position = 1;
            let lb = document.getElementById("leaderboard")
            response.forEach(element => {
                console.log(element.url);
                lb.innerHTML 
                += `<tr>
                    <td style="font-size: 4vh"><b>Rank ${position}</b></td>
                    <td style="text-align: center;"><img onclick=viewCat(${element.pictureID}) src="${element.url}" alt="" width=300></img></td>
                    <td style="font-size: 4vh;">Votes: ${element.votes}</td>
                    </tr>`
                    position++;         
            });   
        
        }
    };

    viewCat = async (id) => {
        console.log("click view cat");
        window.location.href = `/Frontend/cat.html?id=${id}`;
    }
}

