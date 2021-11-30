const xhttp = new XMLHttpRequest();
const GET = 'GET';
const POST = 'POST';
const endPointRoot = 'hostedip';
const localEndPointRoot = 'https://inyoungkang.me'
const catAPI = 'https://thatcopy.pw/catapi/restId/';
const catURL = '/api/v1/cat';

let catImgDiv = document.getElementById("catPic");
let commentDiv = document.getElementById("catComments")
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get('id')

//UserName : Comments
let getOneCat = async () =>  {

    // comments
    let url1 = localEndPointRoot + catURL + "/" + id + '/catorcatappapikey';
    const response = await axios.get(url1);
    
    // images
    const response2 = await axios.get(catAPI + id);

    console.log(response.data);
    catImgDiv.src = response2.data.webpurl;

    let comments = response.data;
    console.log(comments);
    comments.forEach(obj => {
        commentDiv.innerHTML += `</br> ${obj.name}: ${obj.comment}`;
    })
}

let inputValidator = (input) => {
    if (input.trim() == "") {
        alert("Comment cannot be blank. Please try again");
        return false;
    }
    return true;
}

let postComment = async () => {
    console.log('userinfo',userInfo);
    if (inputValidator(document.getElementById("comment").value)) {
            let data = {
                comment : document.getElementById("comment").value,
                pictureID : id,
                userID : userInfo.userid,
                apikey: 'catorcatappapikey'
        }
        const response = await axios({
            method: 'POST',
            url: localEndPointRoot + catURL + "/comments/" + id,
            data: data
        })/*.finally(window.location.href = `/cat.html?id=${id}`)*/

        //window.location.href = `/Frontend/cat.html?id=${id}`;
    }


 
}

let postCommentButton = async () => {
    postComment().then(window.location.href = `/cat.html?id=${id}`);
}