var express = require('express');
var router = express.Router();
var db = require('../lib/mysql');
var crypto = require('crypto');

/*
// Things to do
// 1. login session check
// 1.1 login
// 1.2 board
// 1.3 upload
// 1.4 mypage

// 2. upload::redirect()
// * html handling required
// 2.1 whether title is entered
// 2.2 whether file is uploaded
// 2.3 special character checking
// * backend handling required
// 2.1 whether is guitar profile in right form
// 3. login::redirect()
// * html handling required

// 3.1 [*]whether id is entered
// 3.2 [*]whether password is entered
// 3.3 [*](my idea) special character checking
// * backend handling required
// 3.1 id/email and pw matching handling

// 4. singup::redirect()
// * html handling required
// 4.1 [*]whether id is entered
// 4.2 [*]whether password is entered
// 4.3 [*]email form checker
// 4.4 [*]special character checking
// 4.5 [*]ON ERROR: redirect into other pages
//               i.e. /auth/signup/error1, /auth/signup/error2, ...

// 5. html all-around
// <title> checking
*/
const MODE_DEBUG = true;

const MSG_LOGIN_NODATA = "존재하지 않는 별명/이메일이거나 비밀번호가 일치하지 않습니다.";
const MSG_SIGNUP_EXIST_NICKNAME = "이미 존재하는 별명입니다. 사용하실 수 없습니다.";
const MSG_SIGNUP_EXIST_EMAIL = "이미 존재하는 이메일입니다. 사용하실 수 없습니다.";

router.get('/login', function(req, res, next) {
    res.render('login', {isLogined : false});
});

router.post('/login/process', function(req, res, next) {
    var nickname = req.body.nickname;
    var password = req.body.password;

    if(MODE_DEBUG){
        console.log("loginID: " + nickname);
        console.log("passwd:  " + password);
    }

    // sql query
    var sql = `
    SELECT * 
    FROM userlist
    WHERE nickname='${nickname}'
    OR email='${nickname}'
    `;

    // inserting into sql
    db.query(sql, function(err, rows) {
        if(err) next(err);
        if(MODE_DEBUG){
            console.log(rows);
            console.log("rows.length: " + rows.length);
        }
        if(rows.length == 0){
            if(MODE_DEBUG){
                console.log("There are no matching email/nickname for input data");
            }
            res.redirect('/auth/login');
        }
        else {
            var uid = rows[0]["uid"];
            var nickname = rows[0]["nickname"];
            var encryptedPassword = rows[0]["password"];
            var salt = rows[0]["salt"];
            
            if(MODE_DEBUG){
                console.log(rows);
                console.log("uid     : " + uid);
                console.log("nickname: " + nickname);
                console.log("salt    : " + salt);
                console.log("password: " + encryptedPassword);
            }

            // encryption
            crypto.pbkdf2(password, salt, 491052, 64, 'sha512', (err, key) => {
                if(encryptedPassword == key.toString('base64')){
                    // right answer

                    if(MODE_DEBUG){
                        console.log("encpw   : " + encryptedPassword);
                        console.log("encnow  : " + key.toString('base64'));
                        console.log("key match.");
                    }

                    // login session
                    req.session.logined = true;
                    req.session.user_id = nickname;

                    res.send("login succeed.");
                    // res.redirect("/");
                }else{
                    // wrong password or id 로그인 실패
                    if(MODE_DEBUG){
                        console.log("encpw   : " + encryptedPassword);
                        console.log("encnow  : " + key.toString('base64'));
                        console.log("key mismatch.");
                    }

                    res.redirect('/auth/login');
                }
            });
        }
    })
});

router.get('/logout', function(req, res, next) {
    req.session.destroy();
    res.redirect('/');
});

router.get('/signup', function(req, res, next) {
    res.render('signup', {isLogined : false});
});

router.post('/signup/process', function(req, res, next){
    var nickname = req.body.nickname;
    var email = req.body.email;
    var password = req.body.password;

    let sql = `
    SELECT * 
    FROM userlist
    WHERE nickname='${nickname}'
    `;

    // inserting into sql
    db.query(sql, function(err, rows) {
        if(err) next(err);
        else if(rows.length){
            if(MODE_DEBUG){
                // already having account
                console.log("rows: " + rows);
                console.log("rlen: " + rows.length);
                console.log("already have an nickname.");
            }
            
            //alert(MSG_SIGNUP_EXIST_NICKNAME);
            res.redirect('/auth/signup');
        }else{

            sql = `
            SELECT * 
            FROM userlist
            WHERE email='${email}'
            `;

            db.query(sql, function(err, rows){
                if(err) next(err);
                else if(rows.length){
                    if(MODE_DEBUG){
                        // already having account
                        console.log("rows: " + rows);
                        console.log("rlen: " + rows.length);
                        console.log("already have an email.");
                    }
                    //alert(MSG_SIGNUP_EXIST_EMAIL);
                    res.redirect('/auth/signup');
                }else{
                    // OK ROUTE
                    if(MODE_DEBUG){
                        console.log('nickname: ' + nickname);
                        console.log('email   : ' + email);
                        console.log('password: ' + password);
                    }

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
                                if(MODE_DEBUG){
                                    console.log('salt: ' + salt);
                                    console.log('enpw: ' + encryptedPassword);
                                }

                                // sql query
                                sql = `
                                INSERT INTO userlist(nickname, email, password, salt)
                                VALUES('${nickname}', '${email}', '${encryptedPassword}', '${salt}')
                                `;
                            
                                // inserting into sql
                                db.query(sql, function(err, result) {
                                    if(err) next(err)
                                    else {
                                        if(MODE_DEBUG){
                                            console.log(result);
                                        }
                                        // 차후 적용: // res.redirect('/auth/signup', {isOk?});
                                        //res.send(nickname + '<br />' + email + '<br />' + password);
                                        res.redirect('/auth/login')
                                    }
                                });
                            });
                        }
                    });
                }
            });
        }
    });
});

module.exports = router;