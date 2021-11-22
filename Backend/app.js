const express = require('express');
const mysql = require('mysql');
const PORT = process.env.PORT || 8000;
const resource = '/API/v1/chatlog';
const app = express();
const fs = require('fs');
const http = require('http');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'admin',
    password: 'password1234abcd',
    database: 'chatroom',
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

app.post(resource, (req, res) => {
    let body = "";
    req.on('data', function (chunk) {
        if (chunk != null) {
            body += chunk;
        }
    });

    req.on('end', () => {
        let values = JSON.parse(body);
        console.log(values);
        let sql = `INSERT INTO chatlog(name, message) values ('${values.name}', ${values.msg})`;
        db.query(sql, (Sqlerr, result) => {
            if (Sqlerr) {
                throw Sqlerr;
            };
            res.status(200).send(`${values.name}:${values.msg} was stored in DB`);
        });
    });
});

app.get(resource, (req, res) => {
    let sql = `SELECT * FROM chatlog`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.status(200).send(`${JSON.stringify(result)}`);
    });
});

var server = http.createServer(options, app);

server.listen(PORT, (err) => {
    if (err) throw err;
    console.log("Listening to port", PORT);
});
