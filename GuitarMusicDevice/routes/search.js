var express = require('express');
var router = express.Router();
var db = require('../lib/mysql');

router.get('/:page', function(req, res, next) {
    var search = req.param("musicName");
    var page = req.params.page;
    var sql = `
    SELECT idx, title, name, date_format(updateDate,'%Y-%m-%d') updateDate 
    FROM board 
    WHERE title LIKE "%${search}%" OR name LIKE "%${search}%"`;
    console.log(search);
    console.log(page);
    console.log(sql);
    db.query(sql, function(err, result) {
        if(err) next(err)
        else {
            // console.log(result);
            res.render('board', {list: result, page: page, page_num: 10});
        }
    })
});

module.exports = router;