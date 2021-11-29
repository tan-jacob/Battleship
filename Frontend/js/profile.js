document.getElementById('username').innerHTML = `${userInfo.username}'s Profile!`;

let commentsDiv = document.getElementById('comdiv');

let url = `http://localhost:8888/api/v1/cat/comments/user/${userInfo.userid}`;

axios.get(url).then(res => {
    
    let data = res.data;

    console.log(data);
    for (i = 0; i < data.length; i++) {
        let p = document.createElement('p');
        p.innerHTML = `Comment made on picture ${res.data[i].pictureID}: ${res.data[i].comment}`;
        commentsDiv.appendChild(p);
    }
    
}).catch(function(error) {
    console.log(error);
});