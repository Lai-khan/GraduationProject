var express = require('express');
var router = express.Router();
var db = require('../lib/mysql');
var crypto = require('crypto');

router.get('/login', function(req, res, next) {
    res.render('login');
    /*
    *박제*
    if(req.session.logined){
        res.send('logged in as.. ' + req.session.user_id);
        //res.redirect();
    }else{
        res.render('login');
    }
    */
});

router.post('/login/process', function(req, res, next) {
    var loginID = req.body.loginID;
    var password = req.body.password;

    // DB에서 id, pw, salt 회수
    // id를 salt로 암호화
    // pw, encpw를 비교
    // 맞다면 세션 추가

    // sql query
    var sql = `
    SELECT * 
    FROM userlist
    WHERE nickname='${loginID}'
    `;

    // inserting into sql
    db.query(sql, function(err, rows) {
        if(err) next(err);
        else {
            var uid = rows[0]["uid"];
            var nickname = rows[0]["nickname"];
            var encryptedPassword = rows[0]["password"];
            var salt = rows[0]["salt"];
            
            console.log(rows);
            console.log("uid     : " + uid);
            console.log("nickname: " + nickname);
            console.log("salt    : " + salt);
            console.log("password: " + encryptedPassword);

            // encryption
            crypto.pbkdf2(password, salt, 491052, 64, 'sha512', (err, key) => {
                if(encryptedPassword == key.toString('base64')){
                    // right answer
                    console.log("encpw   : " + encryptedPassword);
                    console.log("encnow  : " + key.toString('base64'));
                    console.log("key match.");

                    // login session
                    req.session.logined = true;
                    req.session.user_id = nickname;

                    res.send("login succeed.");
                    // res.redirect("/");
                }else{
                    // wrong password or id 로그인 실패
                    console.log("encpw   : " + encryptedPassword);
                    console.log("encnow  : " + key.toString('base64'));
                    console.log("key mismatch.");

                    res.send("login failed.");
                    // errorCode : 1 // 아이디 오류
                    // errorCode : 2 // 비밀번호 오류
                    // errorCode : 3 ...
                    // res.render("login", {errorCode = 1});
                }
            });
        }
    })
});

router.post('/logout', function(req, res, next) {
    req.session.destroy();
    res.redirect();
    // res.redirect('/');
});

router.get('/signup', function(req, res, next) {
    res.render('signup');
});

router.post('/signup/process', function(req, res, next){
    var nickname = req.body.nickname;
    var email = req.body.email;
    var password = req.body.password;

    let sql = `
    SELECT * 
    FROM userlist
    WHERE nickname='${nickname}'
    OR email='${email}'
    `;

    // inserting into sql
    db.query(sql, function(err, rows) {
        if(err) next(err);
        else if(rows.length){
            console.log("rows: " + rows);
            console.log("rlen: " + rows.length);
            // already having account
            console.log("already have an account.");
            // you need to make additional endpoint for this route.
            // res.redirect('/auth/signup');
        }else{
            // remove later
            console.log('nickname: ' + nickname);
            console.log('email   : ' + email);
            console.log('password: ' + password);

            var salt = '';
            var encryptedPassword = '';

            // making salt, as 64 byte
            crypto.randomBytes(64, (err, buf) => {
                if(err) next(err);
                else{
                    salt = buf.toString('base64');

                    // making pw encrypted, as 64 byte
                    crypto.pbkdf2(password, buf.toString('base64'), 491052, 64, 'sha512', (err, key) => {
                        encryptedPassword = key.toString('base64');
                        console.log('salt: ' + salt);
                        console.log('enpw: ' + encryptedPassword);
                        // board -> music
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
                                // 차후 적용: // res.redirect('/auth/signup', {isOk?});
                                res.send(nickname + '<br />' + email + '<br />' + password);
                            }
                        })
                    })
                }
            })
        }
    });
});

module.exports = router;