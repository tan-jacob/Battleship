//this will be how the leaderboard is generated

function showLeaderboard() {
    let lb = document.getElementById("leaderboard");


    let url = 'https://inyoungkang.me/api/v1/leaderboard/10/catorcatappapikey';

    axios.get(url).then(res => {
        //console.log(res.data);
        let position = 1;
        
        res.data.forEach(element => {
            console.log(element.url);
            lb.innerHTML 
            += `<tr>
                <td style="font-size: 4vh"><b>Rank ${position}</b></td>
                <td style="text-align: center;"><img onclick=viewCat(${element.pictureID}) src="${element.url}" alt="" height=250></img></td>
                <td style="font-size: 4vh;">Votes: ${element.votes}</td>
                </tr>`
                position++;         
        });   

        //testdiv.innerHTML = res.data;
    }).catch(function(error) {
        console.log(error);
    });
}

viewCat = async (id) => {
    //console.log("click view cat");
    window.location.href = `/cat.html?id=${id}`;
}



