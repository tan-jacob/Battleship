const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const express = require('express');
const axios = require('axios');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
//const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const swaggerJsdoc = require("swagger-jsdoc");

const PORT = process.env.PORT || 9000;
const resource = '/api/v1';
const adminURL = '/api/v1/admin';
const catURL = '/api/v1/cat';
const catAPI = 'https://thatcopy.pw/catapi/rest/';

const TOKEN_SECRET = process.env.TOKEN_SECRET;

const EXPIRY = 300;

const app = express();

// const db = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "ISATeamD5",
//     database: 'isaproject',
// });

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
    res.header('Access-Control-Allow-Origin', 'https://battleship-ko7ii.ondigitalocean.app');
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

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//get all counters to be viewed in the admin.html page
app.get('/resource/:apikey', function(req, res) {
    let sqlTrack = `UPDATE resource SET stat = stat + 1 WHERE resourceid = 13`
    db.query(sqlTrack, function(err, result) {
        if (err) {
            res.status(404).send("Error: " + err.message);
            throw err;
        } else {
            //res.status(201).send("Success");
        }
        console.log("1 stat updated");
    });

    const s = `SELECT * FROM apikey WHERE apikey = '${req.params.apikey}'`;

    db.promise(s)
    .then(async (apiResult) => {
        console.log("api result" + apiResult);
        let sql;

        console.log("res.length" + apiResult.length);
        if (apiResult.length > 0) {
            // user has apikey

            if (req.params.apikey == "myadminkey") {
                let sql = `SELECT * FROM resource`;
                db.query(sql, function(err, result) {
                    if (err) {
                        res.status(404).send("Error: " + err.message);
                        throw err;
                    } else {
                        res.status(201).send(result);
                    }
                    console.log("1 stat updated");
                });
            } else {
                res.status(404).send("Key does not have access");
            }
            
        } else {
            throw `401 Unauthorized! Wrong APIKey`;
        }
    }).then((result) => {
        console.log(result);
    }).catch((err) => {
        console.log("api key errors" + err);
    });
});

//User registration
app.post(`/register`, jsonParser, (req, res) => {

    console.log(req.body.apikey);
    let sqlTrack = `UPDATE resource SET stat = stat + 1 WHERE resourceid = 1`;
    db.query(sqlTrack, function(err, result) {
        if (err) {
            res.status(404).send("Error: " + err.message);
            throw err;
        } else {
            //res.status(201).send("Success");
        }
        console.log("1 stat updated");
    });

    const s = `SELECT * FROM apikey WHERE apikey = '${req.body.apikey}'`;

    db.promise(s)
    .then(async (apiResult) => {
        console.log("api result" + apiResult);
        let sql;

        console.log("res.length" + apiResult.length);
        if (apiResult.length > 0) {
            // user has apikey
            console.log("req.body" + req.body);
            const hashedPassword = await bcrypt.hash(req.body.password, 10);

            console.log(hashedPassword);

            let data;
        
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

        } else {
            throw `401 Unauthorized! Wrong APIKey`;
        }
    }).then((result) => {
        console.log(result);
    }).catch((err) => {
        console.log("api key errors" + err);
    });
     
});

//User login
app.post(`/login`, jsonParser, async (req, resLogin) => {
    let sqlTrack = `UPDATE resource SET stat = stat + 1 WHERE resourceid = 2`
    db.query(sqlTrack, function(err, result) {
        if (err) {
            res.status(404).send("Error: " + err.message);
            throw err;
        } else {
            //res.status(201).send("Success");
        }
        console.log("1 stat updated");
    });

    const s = `SELECT * FROM apikey WHERE apikey = '${req.body.apikey}'`;

    db.promise(s)
    .then(async (apiResult) => {
        console.log("api result" + apiResult);
        let sql;

        console.log("res.length" + apiResult.length);
        if (apiResult.length > 0) {
            // user has apikey
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
                    console.log(req.body.password);
                    console.log(resProm[0].password);
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
                        return resLogin.status(400).json({success: false, message: 'passwords do not match'});
                        }
                    });
                }
            }).catch((err) => {
                console.log(err);
            })

        } else {
            throw `401 Unauthorized! Wrong APIKey`;
        }
    }).then((result) => {
        console.log(result);
    }).catch((err) => {
        console.log("api key errors" + err.message);
    });
});

//admin
app.post(`/adminlogin`, jsonParser, async (req, resLogin) => {
    let sqlTrack = `UPDATE resource SET stat = stat + 1 WHERE resourceid = 13`
    db.query(sqlTrack, function(err, result) {
        if (err) {
            res.status(404).send("Error: " + err.message);
            throw err;
        } else {
            //res.status(201).send("Success");
        }
        console.log("1 stat updated");
    });

    console.log('admin api' + req.body.apikey);
    const s = `SELECT * FROM apikey WHERE apikey = 'myadminkey'`;

    db.promise(s)
    .then(async (apiResult) => {
        console.log("api result" + apiResult);
        let sql;

        console.log("res.length" + apiResult.length);
        if (apiResult.length > 0) {
            // user has apikey
            // validate login fields
            if (!(req.body.username && req.body.password)) {
                res.status(400).send("Must input username and password");
            }

            if (req.body.username == 'admin' && req.body.password == '123abcAdm1n') {
                const hashedPassword = await bcrypt.hash(req.body.password, 10);
                let sql = `SELECT * FROM users WHERE username = '${req.body.username}'`;
                db.promise(sql)
                .then((resProm) => {
                    console.log(resProm[0]);
                    if(resProm[0].length == 0) {
                        //user does not exist
                        resLogin.send('user does not exist');
                    } else {
                        console.log(req.body.password);
                        console.log(resProm[0].password);
                        bcrypt.compare(req.body.password, resProm[0].password, function(err, res) {
                            if (err){
                            throw err;
                            }
                            if (res) {
                                
                                let user = {
                                    userid: resProm[0].userID,
                                    username: resProm[0].username,
                                    name: resProm[0].name,
                                    isAdmin: true
                                }
                                //resLogin.cookie("jwt", accessToken, {secure: true, httpOnly: true});
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
            };

        } else {
            throw `401 Unauthorized! Wrong APIKey`;
        }
    }).then((result) => {
        console.log(result);
    }).catch((err) => {
        console.log("api key errors" + err);
    });
})



//Get user info by userid
app.get(`${resource}/user/:userid`, function(req, res) {
    let sqlTrack = `UPDATE resource SET stat = stat + 1 WHERE resourceid = 3`
    db.query(sqlTrack, function(err, result) {
        if (err) {
            res.status(404).send("Error: " + err.message);
            throw err;
        } else {
            //res.status(201).send("Success");
        }
        console.log("1 stat updated");
    });

    const s = `SELECT * FROM apikey WHERE apikey = '${req.body.apikey}'`;

    db.promise(s)
    .then(async (apiResult) => {
        console.log("api result" + apiResult);
        let sql;

        console.log("res.length" + apiResult.length);
        if (apiResult.length > 0) {
            let userid = req.params.userid;
            console.log(userid);

            let sql = `SELECT * FROM users WHERE userid=${userid}`;
            db.query(sql, function(sqlerr, sqlres) {
                if (sqlerr) throw sqlerr;
                //console.log(`${sqlres}`);
                res.status(200).send(JSON.stringify(sqlres));
            });
        
        } else {
            throw `401 Unauthorized! Wrong APIKey`;
        }
    }).then((result) => {
        console.log(result);
    }).catch((err) => {
        console.log("api key errors" + err);
    });
 
});



//Get 2 random cat images 
app.get(catURL + '/:apikey', async function(req, res) {

    let sqlTrack = `UPDATE resource SET stat = stat + 1 WHERE resourceid = 4`
    db.query(sqlTrack, function(err, result) {
        if (err) {
            res.status(404).send("Error: " + err.message);
            throw err;
        } else {
            //res.status(201).send("Success");
        }
        console.log("1 stat updated");
    });

    const s = `SELECT * FROM apikey WHERE apikey = '${req.params.apikey}'`;

    db.promise(s)
    .then(async (apiResult) => {
        console.log("api result" + apiResult);
        let sql;

        console.log("res.length" + apiResult.length);
        if (apiResult.length > 0) {
            // user has apikey
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

        } else {
            throw `401 Unauthorized! Wrong APIKey`;
        }
    }).then((result) => {
        console.log(result);
    }).catch((err) => {
        console.log("api key errors" + err);
    });
})
        
//Get cat info by id
app.get(catURL + '/:pictureid/:apikey', function(req, res) {
    let sqlTrack = `UPDATE resource SET stat = stat + 1 WHERE resourceid = 5`
    db.query(sqlTrack, function(err, result) {
        if (err) {
            res.status(404).send("Error: " + err.message);
            throw err;
        } else {
            //res.status(201).send("Success");
        }
        console.log("1 stat updated");
    });

    const s = `SELECT * FROM apikey WHERE apikey = '${req.params.apikey}'`;

    db.promise(s)
    .then(async (apiResult) => {
        console.log("api result" + apiResult);
        let sql;

        console.log("res.length" + apiResult.length);
        if (apiResult.length > 0) {
            // user has apikey
            let sql = 'SELECT * FROM comments AS c JOIN votes v ON c.pictureID=v.pictureID JOIN picture as p ON c.pictureID=p.pictureID JOIN users as u ON c.userID=u.userID'
            + ` WHERE c.pictureID=${req.params.pictureid}`;
            db.query(sql, function(sqlerr, sqlres) {
                if (sqlerr) throw sqlerr;
                console.log(`${sqlres}`);
                res.status(200).send(JSON.stringify(sqlres));
            });

        } else {
            throw `401 Unauthorized! Wrong APIKey`;
        }
    }).then((result) => {
        console.log(result);
    }).catch((err) => {
        console.log("api key errors" + err);
    });

})

//Getting leaderboard of cats
app.get(`${resource}/leaderboard/:top/:apikey`, function (req, res) {

    console.log(req.params);

    let sqlTrack = `UPDATE resource SET stat = stat + 1 WHERE resourceid = 7`
    db.query(sqlTrack, function(err, result) {
        if (err) {
            res.status(404).send("Error: " + err.message);
            throw err;
        } else {
            //res.status(201).send("Success");
        }
        console.log("1 stat updated");
    });

    const s = `SELECT * FROM apikey WHERE apikey = '${req.params.apikey}'`;

    db.promise(s)
    .then(async (apiResult) => {
        console.log("api result" + apiResult);
        let sql;

        console.log("res.length" + apiResult.length);
        if (apiResult.length > 0) {
            // user has apikey

            console.log(req.params.top);
            let top = req.params.top;

            let sql = `SELECT * FROM votes JOIN picture ON picture.pictureID = votes.pictureID ORDER BY votes DESC LIMIT ${top}` ;
            db.query(sql, function(sqlerr, sqlres) {
                if (sqlerr) throw sqlerr;
                //console.log(`${sqlres}`);
                res.status(200).send(JSON.stringify(sqlres));
            });

        } else {
            throw `401 Unauthorized! Wrong APIKey`;
        }
    }).then((result) => {
        console.log(result);
    }).catch((err) => {
        console.log("api key errors" + err);
    });

    
});

//Getting comments by userid
app.get(`${catURL}/comments/user/:userid/:apikey`, function (req, res) {
    let sqlTrack = `UPDATE resource SET stat = stat + 1 WHERE resourceid = 9`
    db.query(sqlTrack, function(err, result) {
        if (err) {
            res.status(404).send("Error: " + err.message);
            throw err;
        } else {
            //res.status(201).send("Success");
        }
        console.log("1 stat updated");
    });
    const s = `SELECT * FROM apikey WHERE apikey = '${req.params.apikey}'`;

    db.promise(s)
    .then(async (apiResult) => {
        console.log("api result" + apiResult);
        let sql;

        console.log("res.length" + apiResult.length);
        if (apiResult.length > 0) {
            let sql = `SELECT * FROM comments WHERE userID=${req.params.userid}`;

            //console.log(req.params.userid);
            db.query(sql, function(sqlerr, sqlres) {
                if (sqlerr) throw sqlerr;
                //console.log(`${sqlres}`);
                res.status(200).send(JSON.stringify(sqlres));
            });  
        } else {
            throw `401 Unauthorized! Wrong APIKey`;
        }
    }).then((result) => {
        console.log(result);
    }).catch((err) => {
        console.log("api key errors" + err);
    });

});

//Posting comments
app.post(catURL + `/comments/:pictureid/`, jsonParser, function(req, res) {
    let sqlTrack = `UPDATE resource SET stat = stat + 1 WHERE resourceid = 10`
    db.query(sqlTrack, function(err, result) {
        if (err) {
            res.status(404).send("Error: " + err.message);
            throw err;
        } else {
            //res.status(201).send("Success");
        }
        console.log("1 stat updated");
    });
    console.log("postcomment", req.body);
    console.log(req.body.comment);
    console.log(req.body.userID);
    
    const s = `SELECT * FROM apikey WHERE apikey = '${req.body.apikey}'`;

    db.promise(s)
    .then(async (apiResult) => {
        console.log("api result" + apiResult);
        let sql;

        console.log("res.length" + apiResult.length);
        if (apiResult.length > 0) {
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
            

        } else {
            throw `401 Unauthorized! Wrong APIKey`;
        }
    }).then((result) => {
        console.log(result);
    }).catch((err) => {
        console.log("api key errors" + err);
    });
    
});

//Deleting comments
app.delete(`${catURL}/comments/delete/:commentid/:apikey`, jsonParser, function(req, res) {
    let sqlTrack = `UPDATE resource SET stat = stat + 1 WHERE resourceid = 11`
    db.query(sqlTrack, function(err, result) {
        if (err) {
            res.status(404).send("Error: " + err.message);
            throw err;
        } else {
            //res.status(201).send("Success");
        }
        console.log("1 stat updated");
    });

    console.log('delete cid', req.params.commentid);

    const s = `SELECT * FROM apikey WHERE apikey = '${req.params.apikey}'`;

    db.promise(s)
    .then(async (apiResult) => {
        console.log("api result" + apiResult);
        let sql;

        console.log("res.length" + apiResult.length);
        if (apiResult.length > 0) {
            // user has apikey
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
        
        } else {
            throw `401 Unauthorized! Wrong APIKey`;
        }
    }).then((result) => {
        console.log(result);
    }).catch((err) => {
        console.log("api key errors" + err);
    });


});

//vote for cat by id
app.put(`${catURL}/vote/:pictureid/:apikey`, jsonParser, function(req, res) {
    let sqlTrack = `UPDATE resource SET stat = stat + 1 WHERE resourceid = 12`
    db.query(sqlTrack, function(err, result) {
        if (err) {
            res.status(404).send("Error: " + err.message);
            throw err;
        } else {
            //res.status(201).send("Success");
        }
        console.log("1 stat updated");
    });

    const s = `SELECT * FROM apikey WHERE apikey = '${req.params.apikey}'`;

    db.promise(s)
    .then(async (apiResult) => {
        console.log("api result" + apiResult);
        let sql;

        console.log("res.length" + apiResult.length);
        if (apiResult.length > 0) {
            // user has apikey
            let sql = `INSERT INTO votes (pictureID, votes) VALUES (${req.params.pictureid}, 1) ON DUPLICATE KEY UPDATE votes = votes + 1;`;

            db.query(sql, function(err, result) {
                if (err) {
                    res.status(404).send("Error: " + err.message);
                throw err;
                } else {
                res.status(201).send("Success");
                }
                console.log("1 record updated");
            });
    } else {
            throw `401 Unauthorized! Wrong APIKey`;
        }
    }).then((result) => {
        console.log(result);
    }).catch((err) => {
        console.log("api key errors" + err);
    });
    
    
})

app.listen(PORT, () => {
    console.log("Listening to port", PORT);
});

