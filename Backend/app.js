const express = require('express');
const axios = require('axios');
const mysql = require('mysql');
const PORT = process.env.PORT || 9000;
const resource = '/api/v1';
const adminURL = '/api/v1/admin';
const bodyParser = require('body-parser')
const catURL = '/api/v1/cat';
const catAPI = 'https://thatcopy.pw/catapi/rest/';
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

//Get 2 random cat images 
app.get(catURL, async function(req, res) {
    const result1 = await axios.get(catAPI);
    const result2 = await axios.get(catAPI);
    let data = { 
        picture1ID: result1.data.id,
        picture1URL: result1.data.webpurl,
        picture2ID: result2.data.id,
        picture2URL: result2.data.webpurl
    };

    let sql = `INSERT IGNORE INTO picture(pictureID, url) VALUES (${result1.data.id}, '${result1.data.webpurl}')`;
    let sql2 = `INSERT IGNORE INTO picture(pictureID, url) VALUES (${result2.data.id}, '${result2.data.webpurl}')`;

    db.query(sql, function(err, result) {
        if (err) {
            res.status(404).send("Error: " + err.message);
            throw err;
        }
        console.log("picture 1 inserted");
    });

    db.query(sql2, function(err, result) {
        if (err) {
            res.status(404).send("Error: " + err.message);
            throw err;
        }
        console.log("picture 2 inserted");
    });
    res.status(200).send(JSON.stringify(data));
})


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

    let sql = `SELECT * FROM votes JOIN picture ON picture.pictureID = votes.pictureID ORDER BY votes DESC LIMIT ${top}` ;
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

app.put(`/comments/:commentid/`, jsonParser, function(req, res) {
    console.log(req.body.comment);
    console.log(req.params.commentid);

    let newComment = {
        commentID: req.params.commentid,
        comment: req.body.comment
    }

    let sql = `UPDATE comments SET comment='${req.body.comment}' WHERE commentID=${req.params.commentid}`;
    db.query(sql, function(err, result) {
        if (err) {
            res.status(404).send("Error: " + err.message);
            throw err;
        } else {
            res.status(201).send(JSON.stringify(newComment));
        }
        console.log("1 record updated");
    });
});

app.delete(`/comments/:commentid/`, jsonParser, function(req, res) {
    console.log(req.params.commentid);

    let newComment = {
        deletedCommentID: req.params.commentid,
    }

    let sql = `DELETE FROM comments WHERE commentID = ${req.params.commentid}`;
    db.query(sql, function(err, result) {
        if (err) {
            res.status(404).send("Error: " + err.message);
            throw err;
        } else {
            res.status(201).send(JSON.stringify(newComment));
        }
        console.log("1 record delete");
    });
});

app.listen(PORT, () => {
    console.log("Listening to port", PORT);
});

