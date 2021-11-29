require('dotenv').config()
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

function generateAccessToken(username) {
    return jwt.sign(username, TOKEN_SECRET, {expiresIn: '1800s'});
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

app.post('/register', jsonParser, async (req, res) => {

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

app.post(`/login`, jsonParser, async (req, res) => {
    console.log(req.body.password);
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    let accessToken = '';
    let sql = `SELECT * FROM users WHERE username = '${req.body.username}'`;
    let promise = db.promise(sql)
    .then((res) => {
        console.log(res[0]);
        if(res[0].length == 0) {
            //user does not exist
            res.send('user does not exist');
        } else {

            bcrypt.compare(req.body.password, res[0].password, function(err, res) {
                if (err){
                  throw err;
                }
                if (res)
                    accessToken = jwt.sign({
                        data: {
                            userid: req.body.userID,
                            name: req.body.name
                        }
                    }, TOKEN_SECRET, {expiresIn: EXPIRY});
                    res.cookie("jwt", accessToken, {secure: true, httpOnly: true});
                } else {
                  // response is OutgoingMessage object that server response http request
                  return response.json({success: false, message: 'passwords do not match'});
                }
              });
            
            //console.log(accessToken);
            

            
        }
        //console.log('cookie');
        //res.cookie("jwt", accessToken, {secure: true, httpOnly: true});
        //return promise;
    }).catch((err) => {
        console.log(err);
    })
    
    // .finally(() => {
    //     console.log('cookie');
    //     //console.log(accessToken);
    //     res.cookie("jwt", accessToken, {secure: true, httpOnly: true});
    //     res.status(200).send({token: jwt.token});
    //     //return promise;
    // });
    
    //if username and password is correct => sent jwt
    /*
    let accessToken = jwt.sign({
        data: {
            userid: res[0].body.userID,
            name: res[0].body.name
        }
    }, TOKEN_SECRET, {expiresIn: EXPIRY});
    console.log(accessToken);
    res.cookie("jwt", accessToken, {secure: true, httpOnly: true});
    */
   // res.cookie("jwt", accessToken, {secure: true, httpOnly: true});

    //res.end();
})

/* login token
const token = generateAccessToken({ username: req.body.username });
    res.json(token);
    insert token into apikey table
*/


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

//Posting comments
app.post(catURL + `/comments/:pictureid/`, authToken, function(req, res) {
    /*
    jwt.verify(req.token, TOKEN_SECRET, (err, authorizedData) => {
        if(err) {
            console.log('jwt error: ', err);
            res.sendStatus(403);
        } else {
            res.JSON({
                message: 'Verified credentials',
                authorizedData
            });
            console.log('JWT Success');
        }
    })
*/
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

//vote for cat by id
app.put(`/vote/:pictureid`, jsonParser, function(req, res) {
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

