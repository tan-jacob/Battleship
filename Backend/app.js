const express = require('express');
const mysql = require('mysql');
const PORT = process.env.PORT || 8000;
const resource = '/API/v1/chatlog';
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

app.get('/user/:userid', function(req, res) {
    let userid = req.params.userid;
    console.log(userid);

    let sql = `SELECT * FROM users WHERE userid=${userid}`;
    db.query(sql, function(sqlerr, sqlres) {
        if (sqlerr) throw sqlerr;
        console.log(`${sqlres.name}`);
        res.send(JSON.stringify(sqlres));
    });
});

app.post('/user', function(req, res) {
    let username = req.body.username;
    let password = req.body.password;
    let name = req.body.name;

    let sql = `INSERT INTO users(username, password, name) values(${username}, ${password}, ${name})`;
    db.query(sql, function(err, res) {
        if (Err) {
            res.status(404).send("Error: " + err.message);
            throw err;
        } else {
        res.status(201).send(JSON.stringify(res));
        }
        console.log("1 record inserted");
    });
})

app.listen(PORT, () => {
    console.log("Listening to port", PORT);
})

