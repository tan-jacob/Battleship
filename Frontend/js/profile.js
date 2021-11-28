const xhttp = new XMLHttpRequest();
const endPointRoot = "http://localhost:9000";
let params = "?name=John&age=23";
let resource = "";

function postRegister() {
    resource ="/register";
    params = "name=john&email=john@john.com&password=123";
    xhttp.open("POST", endPointRoot + resource, true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send(params);
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("demo").innerHTML =
                this.responseText;
        }
    }
}

function postLogin() {
    resource ="/login";
    params = "email=john@john.com&password=1232";
    xhttp.open("POST", endPointRoot + resource, true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send(params);
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("demo").innerHTML =
                this.responseText;
        }
    }
}

function getAll() {
    resource ="/";
    xhttp.open("POST", endPointRoot + resource, true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("demo").innerHTML =
                this.responseText;
        }
    }
}