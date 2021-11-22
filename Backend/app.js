const express = require('express');
const mysql = require('mysql');
const PORT = process.env.PORT || 3306;
const resource = '/API/v1';
const adminURL = '/API/v1/admin';
const app = express();
const fs = require('fs');
const http = require('http');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'battleship',
});

db.connect((err) => {
    if (err) throw err;
    console.log("Connected!");
});

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
});

let counterGetUserID = 0;
app.get('/user/:userid', function(req, res) {
    counterGetUserID++;
    let userid = req.params.userid;
    console.log(userid);

    let sql = `SELECT * FROM users WHERE userid=${userid}`;
    db.query(sql, function(sqlerr, sqlres) {
        if (sqlerr) throw sqlerr;
        console.log(`${sqlres.name}`);
        res.send(JSON.stringify(sqlres));
    });
});

//get all counters to be viewed in the admin.html page
app.get( adminURL, function(req, res) {
    res.send({
        counterGetUserID,
        counterPostUser
    });
    
});

let counterPostUser = 0;
app.post('/user', function(req, res) {
    counterPostUser++;
    let username = req.body.username;
    let password = req.body.password;
    let name = req.body.name;

    let sql = `INSERT INTO users(username, password, name) values(${username}, ${password}, ${name})`;
    db.query(sql, function(err, res) {
        if (err) {
            res.status(404).send("Error: " + err.message);
            throw err;
        } else {
        res.status(201).send(JSON.stringify({res: res, requestCount: counterPostUser}));
        }
        console.log("1 record inserted");
    });
})

app.listen(PORT, () => {
    console.log("Listening to port", PORT);
})

