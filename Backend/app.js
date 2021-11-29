const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const express = require('express');
const axios = require('axios');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
//const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');

const PORT = process.env.PORT || 8888;
const resource = '/api/v1';
const adminURL = '/api/v1/admin';
const catURL = '/api/v1/cat';
const catAPI = 'https://thatcopy.pw/catapi/rest/';

const TOKEN_SECRET = process.env.TOKEN_SECRET;

const EXPIRY = 300;

const app = express();

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: 'isaproject',
});

db.connect((err) => {
    if(err) { throw err; }
    console.log("mysql: connected");
});

var jsonParser = bodyParser.json();

app.use(function (req, res, next){
    res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
});

db.promise = (sql) => {
    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
            if (err) { reject(new Error()); }
            else { resolve(result); }
        })
    })
}

function authToken(req, res, next) {
    const authHeader = req.headers['auth'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.status(401).send();

    jwt.verify(token, TOKEN_SECRET, (err, user) => {
        console.log(err);

        if (err) return res.status(403).send();

        req.user = user

        next();
    });
}

app.post(`${resource}/register`, jsonParser, async (req, res) => {

    console.log(req.body);
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    console.log(hashedPassword);
   
    let sql = `SELECT * FROM users WHERE username = '${req.body.username}'`;
    db.promise(sql)
    .then((res) => {
        console.log(res);
        let sql;
        if (res.length == 0) {
            sql = `INSERT INTO users (name, username, password) VALUES ('${req.body.name}', '${req.body.username}', '${hashedPassword}')`;
            return db.promise(sql);
        } else {
            throw 'USERNAME TAKEN';
        }
    }).then((res) => {
        console.log(res.message);
    }).catch((err) => {
        console.log(err);
    });
});

app.post(`/login`, jsonParser, async (req, resLogin) => {
    
    // validate login fields
    if (!(req.body.username && req.body.password)) {
        res.status(400).send("Must input username and password");
      }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    let sql = `SELECT * FROM users WHERE username = '${req.body.username}'`;
    db.promise(sql)
    .then((resProm) => {
        console.log(resProm[0]);
        if(resProm[0].length == 0) {
            //user does not exist
            resLogin.send('user does not exist');
        } else {
            bcrypt.compare(req.body.password, resProm[0].password, function(err, res) {
                if (err){
                  throw err;
                }
                if (res) {
                    let accessToken = jwt.sign({
                        userid: resProm[0].userID,
                        username: resProm[0].username,
                        name: resProm[0].name
                    }, TOKEN_SECRET, {expiresIn: EXPIRY});
                    
                    let user = {
                        userid: resProm[0].userID,
                        username: resProm[0].username,
                        name: resProm[0].name
                    }
                    resLogin.cookie("jwt", accessToken, {secure: true, httpOnly: true});
                    resLogin.status(201).send(user);
                } else {
                  // response is OutgoingMessage object that server response http request
                  return resLogin.json({success: false, message: 'passwords do not match'});
                }
            });
        }
    }).catch((err) => {
        console.log(err);
    })
    

})

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

//Get cat info by id
app.get(catURL + '/:pictureid', function(req, res) {
    let sql = 'SELECT * FROM comments AS c JOIN votes v ON c.pictureID=v.pictureID JOIN picture as p ON c.pictureID=p.pictureID JOIN users as u ON c.userID=u.userID'
    + ` WHERE c.pictureID=${req.params.pictureid}`;
    db.query(sql, function(sqlerr, sqlres) {
        if (sqlerr) throw sqlerr;
        console.log(`${sqlres}`);
        res.status(200).send(JSON.stringify(sqlres));
    });
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

app.get(`${resource}/leaderboard/:top`, function (req, res) {
    let top = req.params.top;
    console.log(top);

    let sql = `SELECT * FROM votes JOIN picture ON picture.pictureID = votes.pictureID ORDER BY votes DESC LIMIT ${top}` ;
    db.query(sql, function(sqlerr, sqlres) {
        if (sqlerr) throw sqlerr;
        //console.log(`${sqlres}`);
        res.status(200).send(JSON.stringify(sqlres));
    });
});

app.get(`${catURL}/comments/:pictureid`, function (req, res) {
    let pictureid = req.params.pictureid;
    console.log(pictureid);

    let sql = `SELECT * FROM comments WHERE pictureID=${pictureid}`;
    db.query(sql, function(sqlerr, sqlres) {
        if (sqlerr) throw sqlerr;
        //console.log(`${sqlres}`);
        res.status(200).send(JSON.stringify(sqlres));
    });
});

app.get(`${catURL}/comments/user/:userid`, function (req, res) {
    let sql = `SELECT * FROM comments WHERE userID=${req.params.userid}`;

    //console.log(req.params.userid);
    db.query(sql, function(sqlerr, sqlres) {
        if (sqlerr) throw sqlerr;
        //console.log(`${sqlres}`);
        console.log("pls" + sqlres);
        res.status(200).send(JSON.stringify(sqlres));
    });
});

//Posting comments
app.post(catURL + `/comments/:pictureid/`, jsonParser, function(req, res) {
    console.log("postcomment", req.body);
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

app.put(`${catURL}/comments/:commentid/`, jsonParser, function(req, res) {
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

app.delete(`${catURL}/comments/delete/:commentid/`, jsonParser, function(req, res) {
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

//vote for cat by id
app.put(`${catURL}/vote/:pictureid`, jsonParser, function(req, res) {
    let sql = `UPDATE votes SET votes = votes + 1 WHERE pictureid = ${req.params.pictureid}`

    db.query(sql, function(err, result) {
        if (err) {
            res.status(404).send("Error: " + err.message);
            throw err;
        } else {
            res.status(201).send("Success");
        }
        console.log("1 record updated");
    });
})

app.listen(PORT, () => {
    console.log("Listening to port", PORT);
});

