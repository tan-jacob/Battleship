const xhttp = new XMLHttpRequest();
const GET = 'GET';
const POST = 'POST';
const endPointRoot = 'hostedip';
const localEndPointRoot = 'http://localhost:8888'
const catAPI = 'https://thatcopy.pw/catapi/rest/';
const catURL = '/api/v1/cat';

let catImgDiv = document.getElementById("catPic");
let commentDiv = document.getElementById("catComments")
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get('id')

//UserName : Comments
let getOneCat = async () =>  {
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
        pictureID : id,
    }
    console.log(commentObj);
    const response = await axios.post(localEndPointRoot + catURL + "/comments/" + id , commentObj, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    
}