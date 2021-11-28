//this will be how the leaderboard is generated
const xhttp = new XMLHttpRequest();
//const { default: axios } = require("axios");
const GET = 'GET';
const POST = 'POST';

const localEndPointRoot = 'http://localhost:8888'
const resource = '/api/v1';
const url = localEndPointRoot + resource;
const lboardurl = '/leaderboard/'

// const db = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: 'dbnamehere',
// });
// function showLeaderboard() {
//     console.log("show leaderboard");
//     axios.get(url + lboardurl, {
//         method: 'get',
//     }).then(res => {
//         let catTable = JSON.parse(this.res);
//         console.log(catTable);
//     })
// }

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
                    <td style="font-size: 4vh;">Rank ${position}</td>
                    <td style="text-align: center;"><img src="${element.url}" alt="" width=350></img></td>
                    <td style="font-size: 4vh;">Votes: ${element.votes}</td>
                    </tr>`
                    position++;         
            });   
//
        
        }
    };
}