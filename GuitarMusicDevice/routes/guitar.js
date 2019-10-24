var express = require('express');
var router = express.Router();
var db = require('../lib/mysql');

router.get('/:file', function(req, res, next) {
    var file = req.params.file;
    console.log(file);
    var sql = `SELECT filename FROM music WHERE idx = ${file}`;
    db.query(sql, function(err, filename) {
        if(err) next(err);
        else {
            console.log(filename);
            res.render('guitar', {guitarPro: filename});
        }
    })
});

module.exports = router;