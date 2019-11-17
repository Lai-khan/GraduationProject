var express = require('express');
var router = express.Router();
var db = require('../lib/mysql');

router.get('/:file', function(req, res, next) {
    var file = req.params.file;
    console.log(file);
    var sql = `SELECT * FROM music WHERE idx = ?`;
    db.query(sql, [file], function(err, result) {
        if(err) next(err);
        else {
            console.log(result);
            res.render('guitar', {guitarPro: result});
        }
    })
});

module.exports = router;