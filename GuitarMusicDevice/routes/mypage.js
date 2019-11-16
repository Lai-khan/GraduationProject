var express = require('express');
var router = express.Router();
var db = require('../lib/mysql');

router.get('/sheet/:page', function(req, res, next) {
    var page = req.params.page;
    var url = "/mypage/sheet/"
    var sql = `SELECT idx, title, date_format(updateDate,'%Y-%m-%d') updateDate
    FROM board
    WHERE name = "백우"`;
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
    res.send(idx);
});

router.get('/info', function(req, res, next) {
    var state = "info";
    res.render('inputPW', {isLogined : true, state, state});
});

router.post('/info/process', function(req, res, next) {
    res.redirect('myinfo')
});

router.get('/info/myinfo', function(req, res, next) {
    res.render('info', {isLogined : true});
});

router.get('/leave', function(req, res, next) {
    var state = "leave";
    res.render('inputPW', {isLogined : true, state, state});
});

router.post('/leave/really', function(req, res, next) {
    console.log(req.body.password);
    res.render('leave', {isLogined : true});
});

module.exports = router;