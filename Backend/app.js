const express = require('express');
const mysql = require('mysql');
const PORT = process.env.PORT || 9000;
const resource = '/API/v1';
const adminURL = '/API/v1/admin';
const app = express();
const cors = require('cors');

const db = mysql.createConnection({
    host: "localhost",
    user: "lab",
    password: "ISATeamD5",
    database: 'battleship',
});

db.connect((err) => {
    if (err) throw err;
    console.log("Connected!");
});

app.use(express.json());

app.use(function (req, res, next){
    res.header('Access-Control-Allow-Origin', 'https://battleship-ko7ii.ondigitalocean.app');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
});



let counterGetUserID = 0;
app.get(`${resource}/user/:userid`, function(req, res) {
    counterGetUserID++;
    let userid = req.params.userid;
    console.log(userid);

    let sql = `SELECT * FROM users WHERE userid=${userid}`;
    db.query(sql, function(sqlerr, sqlres) {
        if (sqlerr) throw sqlerr;
        //console.log(`${sqlres}`);
        res.send(JSON.stringify(sqlres));
    });
});

//get all counters to be viewed in the admin.html page
app.get( adminURL, function(req, res) {
    let data = {
        get: counterGetUserID,
        post: counterPostUser
    };
    console.log(data.get);
    res.status(200).send(JSON.stringify(data));
});

let counterPostUser = 0;
app.post(`${resource}/user`, function(req, res) {
        counterPostUser++;

        console.log(req.body);
        console.log(req.body.name);
        
        let newUser = {
            name: req.body.name,
            username: req.body.username,
            password: req.body.password
        }

        let sql = `INSERT INTO users(userID, name, username,password) VALUES (DEFAULT, '${newUser.name}', '${newUser.username}', '${newUser.password}')`;
        db.query(sql, function(err, result) {
            if (err) {
                res.status(404).send("Error: " + err.message);
                throw err;
            } else {
                res.status(201).send(JSON.stringify(newUser));
            }
            console.log("1 record inserted");
        });
});

app.listen(PORT, () => {
    console.log("Listening to port", PORT);
})

