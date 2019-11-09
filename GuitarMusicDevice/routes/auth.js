var express = require('express');
var router = express.Router();
var db = require('../lib/mysql');
var crypto = require('crypto');

router.get('/login', function(req, res, next) {
    res.render('login');
});

router.get('/login/process', function(req, res, next) {
    res.redirect();
});

router.get('/logout', function(req, res, next) {
    res.redirect();
});

router.get('/signup', function(req, res, next) {
    res.render('signup');
});

router.post('/signup/process', function(req, res, next){
    var nickname = req.body.nickname;
    var email = req.body.email;
    var password = req.body.password;

    // remove later
    console.log('nickname: ' + nickname);
    console.log('email   : ' + email);
    console.log('password: ' + password);

    var salt = '';
    var encryptedPassword = '';

    // making salt, as 73 byte
    crypto.randomBytes(73, (err, buf) => {
        if(err) next(err);
        else{
            salt = buf.toString('base64');

            // making pw encrypted, as 71 byte
            crypto.pbkdf2(password, buf.toString('base64'), 491052, 71, 'sha512', (err, key) => {
                encryptedPassword = key.toString('base64');
                console.log('salt: ' + salt);
                console.log('enpw: ' + encryptedPassword);

                // sql query
                var sql = `
                INSERT INTO userlist(nickname, email, password, salt)
                VALUES('${nickname}', '${email}', '${encryptedPassword}', '${salt}')
                `;
            
                // inserting into sql
                db.query(sql, function(err, result) {
                    if(err) next(err)
                    else {
                        console.log(result);
                        res.send(nickname + '<br />' + email + '<br />' + password);
                    }
                })
            })
        }
    })
    //res.redirect();
});

module.exports = router;