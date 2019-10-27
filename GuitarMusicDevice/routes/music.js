var express = require('express');
var router = express.Router();
var db = require('../lib/mysql');

router.get('/page/:page', function(req, res, next) {
    var page = req.params.page;
    var url = '/music/page/';
    var sql = `SELECT idx, title, name, date_format(updateDate,'%Y-%m-%d') updateDate FROM board`;
    db.query(sql, function(err, list) {
        if(err) next(err);
        else {
            console.log(list);
            res.render('board', {list: list, page: page, page_num: 10, url: url, state: 1});
        }
    })
});

module.exports = router;