var express = require('express');
var router = express.Router();
var db = require('../lib/mysql');
var crypto = require('crypto');
var fs = require('fs');

var MODE_DEBUG = true;

router.get('/sheet/:page', function(req, res, next) {
    var name = req.session.user_id;
    var page = req.params.page;
    var url = "/mypage/sheet/"
    var sql = `SELECT idx, title, date_format(updateDate,'%Y-%m-%d') updateDate
    FROM board
    WHERE name = "${name}"`;
    db.query(sql, function(err, result) {
        if(err) next(err);
        else {
            console.log(result);
            res.render('mypage', {isLogined : true, list : result, page: page, page_num: 10, url: url});
        }
    })
});

router.post('/delete_process', function(req, res, next) {
    var post = req.body;
    var idx = post.idx;
    var sql1 = `SELECT * FROM music WHERE idx = ${idx}`;
    db.query(sql1, function(err1, rows){
        if(err1) next(err1);
        if(rows.length == 0){
            // 검색 결과 없음
        }else{
            // 파일이름 조회 및 fs로 삭제
            var filename = rows[0]["filename"];
            if(MODE_DEBUG){
                console.log("filename: " + filename);
            }

            fs.unlink('./public/files/' + filename, function(err){
                if(err) next(err);

                var sql2 = `DELETE FROM music WHERE idx = ${idx}`;
                var sql3 = `DELETE FROM board WHERE idx = ${idx}`;
                db.query(sql2, function(err2, result2) {
                    if(err2) next(err2);
                    else {
                        console.log(result2);
                        db.query(sql3, function(err3, result3) {
                            if(err3) next(err3);
                            else {
                                console.log(result3);
                                res.redirect('/mypage/sheet/1');
                            }
                        })
                    }
                })
            })
        }
    })
});

router.get('/info', function(req, res, next) {
    var state = "info";
    res.render('inputPW', {isLogined : true, state : state});
});

router.post('/info/process', function(req, res, next) {
    // password = session.id로 검색한 userlist의 비번과 같은가
    var password = req.body.password;

    var sql = `
    SELECT * FROM userlist
    WHERE nickname='${req.session.user_id}'
    `

    db.query(sql, function(err, rows){
        if(err) next(err);
        if(MODE_DEBUG){
            console.log(rows);
            console.log("rows.length: " + rows.length);
        }
        if(rows.length == 0){
            // no matching email/nickname
            // this should not be happen
            res.send("unexpected error: call administrator to handle this.");
        }else{
            var encpw = rows[0]["password"];
            var salt = rows[0]["salt"];

            crypto.pbkdf2(password, salt, 491052, 64, 'sha512', (err, key) => {
                if(err){
                    next(err);
                }
                if(encpw == key.toString('base64')){
                    // right data
                    res.redirect('/mypage/info/myinfo');
                }else{
                    // wrong pw
                    res.redirect('/mypage/pwError1');
                }
            });
        }
    });
});

router.get('/info/myinfo', function(req, res, next) {
    // select로 user_id 검색해서 id랑 email 변수로 보내고, pug 수정
    var sql = `
    SELECT * FROM userlist
    WHERE nickname='${req.session.user_id}'
    `;

    db.query(sql, function(err, rows){
        if(err) next(err);
        if(MODE_DEBUG){
            console.log(rows);
            console.log("rows.length: " + rows.length);
        }
        if(rows.length == 0){
            // no matching email/nickname
            // this should not be happen
            res.send("unexpected error: call administrator to handle this.");
        }else{
            var id = rows[0]["nickname"];
            var email = rows[0]["email"];

            // 이 값을 통해 수정
            res.render('info', {isLogined : true, id : id, email : email});
        }
    //res.render('info', {isLogined : true});
    })
});

router.get('/leave', function(req, res, next) {
    var state = "leave";
    res.render('inputPW', {isLogined : true, state : state});
});

router.post('/leave_really', function(req, res, next) {
    console.log(req.body.password);
    // password = session.id로 검색한 userlist의 비번과 같은가
    var password = req.body.password;

    var sql = `
    SELECT * FROM userlist
    WHERE nickname='${req.session.user_id}'
    `

    db.query(sql, function(err, rows){
        if(err) next(err);
        if(MODE_DEBUG){
            console.log(rows);
            console.log("rows.length: " + rows.length);
        }
        if(rows.length == 0){
            // no matching email/nickname
            // this should not be happen
            res.send("unexpected error: call administrator to handle this.");
        }else{
            var encpw = rows[0]["password"];
            var salt = rows[0]["salt"];

            //console.log("password: ", password);
            crypto.pbkdf2(password, salt, 491052, 64, 'sha512', (err, key) => {
                if(err){
                    next(err);
                }
                if(encpw == key.toString('base64')){
                    // right data
                    console.log("pw check passed");
                    res.render('leave', {isLogined : true});
                }else{
                    // wrong pw
                    res.redirect('/mypage/pwError2');
                }
            });
        }
    });
    // 같으면
    //res.render('leave', {isLogined : true});
    // 다르면, 에러 -> redirect
    //res.redirect('/mypage/leave');
});

router.post('/leave_process', function(req, res, next) {
    // if yes
    // 1. remember user nickname (is this one applies w/ user_id?)
    // 2. remove user from usertable // via removing password and salt
    //                               // update userlist set password="" where nickname="${req.session.user_id}"
    //                               // update userlist set salt="" where nickname="${req.session.user_id}"
    // 3.0 remember "req.session.user_id + (탈퇴)"
    // 3. update userlist set nickname="${req.session.user_id} where nickname="${req.session.user_id}""

    console.log("leav_process");
    var newNickname = req.session.user_id + " (탈퇴)";

    var sql = `
    UPDATE userlist
    SET password="", salt="" 
    WHERE nickname="${req.session.user_id}"
    `

    db.query(sql, function(err){
        if(err) next(err);

        sql = `
        UPDATE board
        SET name="${newNickname}"
        WHERE name="${req.session.user_id}"
        `

        db.query(sql, function(err){
            if(err) next(err);

            req.session.destroy();
            res.redirect('/');
        });
    });
    // 예
    // 회원 탈퇴 처리하고,
    // board 테이블의 작성자 + '(탈퇴)' 붙이고
    //res.redirect('/');
    // 아니오
    //res.redirect('/mypage/leave');
});

router.get('/pwError:num', function(req, res, next) {
    var num = req.params.num;
    res.render('pwError', {status : num});
});

module.exports = router;