document.getElementById('username').innerHTML = `${userInfo.username}'s Profile!`;

let commentsDiv = document.getElementById('comdiv');

let url = `http://localhost:8888/api/v1/cat/comments/user/${userInfo.userid}`;

axios.get(url).then(res => {
    
    let data = res.data;

    console.log(data);
    for (i = 0; i < data.length; i++) {
        let p = document.createElement('p');
        let div =document.createElement('div');

        p.innerHTML = `Comment made on picture ${res.data[i].pictureID}: ${res.data[i].comment}`;

        let editButton = document.createElement('input');
        editButton.type = 'button';
        editButton.onclick = editComment(res.data[i].commentID);
        editButton.value = "Edit Comment";

        let deleteButton = document.createElement('input');
        deleteButton.type = 'button';
        deleteButton.onclick = deleteComment(res.data[i].commentID);
        deleteButton.value = "Delete Comment";

        div.appendChild(p);
        div.appendChild(editButton);
        div.appendChild(deleteButton);

        commentsDiv.appendChild(div);
    }
    
}).catch(function(error) {
    console.log(error);
});

function editComment(comID) {

}

function deleteComment(comID) {
    let url = `http://localhost:8888/api/v1/cat/comments/delete/${comID}`;

    axios.delete(url).then(res => {
        let response = JSON.parse(res);
        console.log(response);
    }).catch(function(error) {
        console.log(error);
    });
}