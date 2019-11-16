var express = require('express');
var router = express.Router();
var db = require('../lib/mysql');

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
    // sql로 filename 알아내고 -> 파일 삭제 (채민석 담당)
    var sql1 = `DELETE FROM music WHERE idx = ${idx}`;
    var sql2 = `DELETE FROM board WHERE idx = ${idx}`;
    db.query(sql1, function(err1, result1) {
        if(err1) next(err1);
        else {
            console.log(result1);
            db.query(sql2, function(err2, result2) {
                if(err2) next(err2);
                else {
                    console.log(result2);
                    res.redirect('/mypage/sheet/1');
                }
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
    // 같으면
    res.redirect('/mypage/info/myinfo');
    // 다르면, 에러 -> redirect
    res.redirect('/mypage/info');
});

router.get('/info/myinfo', function(req, res, next) {
    // select로 user_id 검색해서 id랑 email 변수로 보내고, pug 수정
    res.render('info', {isLogined : true});
});

router.get('/leave', function(req, res, next) {
    var state = "leave";
    res.render('inputPW', {isLogined : true, state : state});
});

router.post('/leave_really', function(req, res, next) {
    console.log(req.body.password);
    // password = session.id로 검색한 userlist의 비번과 같은가
    // 같으면
    res.render('leave', {isLogined : true});
    // 다르면, 에러 -> redirect
    res.redirect('/mypage/leave');
});

router.post('/leave_process', function(req, res, next) {
    // 예
    // 회원 탈퇴 처리하고,
    // board 테이블의 작성자 + '(탈퇴)' 붙이고
    res.redirect('/');
    // 아니오
    res.redirect('/mypage/leave');
});

module.exports = router;