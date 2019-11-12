var express = require('express');
var router = express.Router();
var db = require('../lib/mysql');

router.get('/', function(req, res, next) {
    if(req.session.logined){
        res.render('mypage');
    }else{
        res.redirect('../');
    }
});

module.exports = router;