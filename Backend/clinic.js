const bcrypt = require('bcrypt');
const express = require('express');
const app = express();
const mysql = require('mysql');
const endPointRoot = "/API/v1";
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: 'isaproject',
});

app.use(function (req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
});

app.use(express.urlencoded({ extended: false}));

db.connect((err) => {
    if (err) {throw err;}
    console.log('Mysql: connected');
})

db.promise = (sql) => {
    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
            if (err) { reject(new Error()); }
            else { resolve(result);}
        })
    })
};

app.post(endPointRoot + '/register', async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    db.promise(`SELECT * FROM users WHERE email= '${req.body.email}'`)
        .then((result) => {
            console.log(result);
            let sql;
            if (result.length == 0) {
                sql = `INSERT INTO user (email, name, password) VALUES ('${req.body.email}', '${req.body.name}', '${hashedPassword}')`;
                return db.promist(sql);
            } else {
                throw 'User with this email already exists';
            }
        }).then((result) => {
            console.log(result.message);
        }).catch((err) => {
            console.log(err);
        })
})

app.post(endPointRoot + '/login', async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    db.promist(`SELECT * FROM user WHERE email='${req.body.email}'`)
    .then((result) => {
        console.log(result[0]);
        if (result[0].length == 0) {
            throw "login failed! wrong username or password";
        }
    }).catch((err) => {
        console.log(err + "check your sql query");
    })
})