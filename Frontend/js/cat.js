const xhttp = new XMLHttpRequest();
const GET = 'GET';
const POST = 'POST';
const endPointRoot = 'hostedip';
const localEndPointRoot = 'http://localhost:8888'
const catAPI = 'https://thatcopy.pw/catapi/rest/';
const catURL = '/api/v1/cat';

let catImgDiv = document.getElementById("catPic");
let commentDiv = document.getElementById("catComments")
//UserName : Comments
let getOneCat = async () =>  {
    let id = req.params.id;
    const response = await axios.get(localEndPointRoot + catURL + "/" + id);
    console.log(response.data);
    catImgDiv.src = response.data[0].url;

    let comments = response.data;
    console.log(comments);
    comments.forEach(obj => {
        commentDiv.innerHTML += `</br> ${obj.name}: ${obj.comment}`;
    })
}

let postComment = async () => {
    let id = req.params.id;

    let commentObj = {
        comment : document.getElementById("comment").innerHTML,
        pictureID : id

    }
    console.log(commentObj);
    const response = await axios.post(localEndPointRoot + catURL + "/comments/" + id);
    
}