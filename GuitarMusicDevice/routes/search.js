var express = require('express');
var router = express.Router();
var db = require('../lib/mysql');

router.get('/:page', function(req, res, next) {
    if(req.session.logined)
        var login = true;
    else
        var login = false;
    var search = req.query.search;
    var sqlSearch = "%" + search + "%";
    var page = req.params.page;
    var url = '/search/';
    var sql = `
    SELECT idx, title, name, date_format(updateDate,'%Y-%m-%d') updateDate 
    FROM board 
    WHERE title LIKE ? OR name LIKE ?`;
    db.query(sql, [sqlSearch, sqlSearch], function(err, result) {
        if(err) next(err)
        else {
            console.log(result);
            res.render('board', {isLogined : login, list: result, page: page, page_num: 10, url: url, searchGet: search, state: 2});
        }
    })
});

module.exports = router;