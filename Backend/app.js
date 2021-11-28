const express = require('express');
const axios = require('axios');
const mysql = require('mysql');
const PORT = process.env.PORT || 9000;
const resource = '/api/v1';
const adminURL = '/api/v1/admin';
const bodyParser = require('body-parser')
const app = express();

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: 'isaproject',
});

var jsonParser = bodyParser.json()

app.use(function (req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
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
        res.status(200).send(JSON.stringify(sqlres));
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

app.get(`/leaderboard/:top`, function (req, res) {
    let top = req.params.top;
    console.log(top);

    let sql = `SELECT * FROM votes ORDER BY votes DESC LIMIT ${top}`;
    db.query(sql, function(sqlerr, sqlres) {
        if (sqlerr) throw sqlerr;
        //console.log(`${sqlres}`);
        res.status(200).send(JSON.stringify(sqlres));
    });
});

app.get(`/comments/:pictureid`, function (req, res) {
    let pictureid = req.params.pictureid;
    console.log(pictureid);

    // join table with users to get name or username 
    let sql = `SELECT * FROM comments WHERE pictureID=${pictureid}`;
    db.query(sql, function(sqlerr, sqlres) {
        if (sqlerr) throw sqlerr;
        //console.log(`${sqlres}`);
        res.status(200).send(JSON.stringify(sqlres));
    });
});

app.post(`/comments/:pictureid/`, jsonParser, function(req, res) {
    console.log(req.body);
    console.log(req.body.comment);
    console.log(req.body.userID);
    
    let newComment = {
        userID: req.body.userID,
        pictureID: req.params.pictureID,
        comment: req.body.comment
    }

    let sql = `INSERT INTO comments(commentID, userID, pictureID, comment) VALUES (DEFAULT, ${req.body.userID} , ${req.body.pictureID}, "${req.body.comment}" )`;
    db.query(sql, function(err, result) {
        if (err) {
            res.status(404).send("Error: " + err.message);
            throw err;
        } else {
            res.status(201).send(JSON.stringify(newComment));
        }
        console.log("1 record inserted");
    });
});

app.listen(PORT, () => {
    console.log("Listening to port", PORT);
});

