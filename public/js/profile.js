document.getElementById('username').innerHTML = `${userInfo.username}'s Profile!`;

let commentsDiv = document.getElementById('comdiv');

if (userInfo.userid != null || userInfo.userid != undefined) {
    document.getElementById('profile').style = block;
} else {
    window.location.href = `/register.html`;
}

let url = `https://inyoungkang.me/api/v1/cat/comments/user/${userInfo.userid}/catorcatappapikey`;

axios.get(url).then(res => {
    
    let data = res.data;

    console.log(data);
    for (i = 0; i < data.length; i++) {
        let p = document.createElement('p');
        let div =document.createElement('div');
        let cID = res.data[i].commentID;
        let comm = res.data[i].comment;
        let pID = res.data[i].pictureID;
        console.log("cID value",cID);

        p.innerHTML = `Comment made on Cat #${pID}:  ${comm}`;
        console.log(res.data[i].commentID);

        let deleteButton = document.createElement('button');
        deleteButton.onclick = function() { deleteComment(cID); }
        deleteButton.innerHTML = "Delete comment"

        div.appendChild(p);
        div.appendChild(deleteButton);

        commentsDiv.appendChild(div);
    }
    
}).catch(function(error) {
    console.log(error);
});

function deleteComment(comID) {
    let url = `https://inyoungkang.me/api/v1/cat/comments/delete/${comID}/catorcatappapikey`;
    console.log(comID);

    axios.delete(url).then(res => {
        let response = JSON.parse(res);
        console.log(response);
        alert("your comment has been deleted");
    }).catch(function(error) {
        console.log(error);
    });
}