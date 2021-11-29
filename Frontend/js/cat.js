const xhttp = new XMLHttpRequest();
const GET = 'GET';
const POST = 'POST';
const endPointRoot = 'hostedip';
const localEndPointRoot = 'http://localhost:8888'
const catAPI = 'https://thatcopy.pw/catapi/restId/';
const catURL = '/api/v1/cat';

let catImgDiv = document.getElementById("catPic");
let commentDiv = document.getElementById("catComments")
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get('id')

//UserName : Comments
let getOneCat = async () =>  {
    const response = await axios.get(localEndPointRoot + catURL + "/" + id);
    const response2 = await axios.get(catAPI + id);

    console.log(response.data);
    catImgDiv.src = response2.data.webpurl;

    let comments = response.data;
    console.log(comments);
    comments.forEach(obj => {
        commentDiv.innerHTML += `</br> ${obj.name}: ${obj.comment}`;
    })
}

let postComment = async () => {
<<<<<<< HEAD
    let data = {
        comment : document.getElementById("comment").value,
=======
    let commentObj = {
        comment : document.getElementById("comment").innerHTML,
>>>>>>> c8aec32b1cecc61581b990f0756b4c47e0e12eee
        pictureID : id,
        userID : 1
    }
    const response = await axios({
        method: 'POST',
        url: localEndPointRoot + catURL + "/comments/" + id,
        data: data
    })

    window.location.href = `/Frontend/cat.html?id=${id}`;
 
}