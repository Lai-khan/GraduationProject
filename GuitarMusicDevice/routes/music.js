var express = require('express');
var router = express.Router();
var db = require('../lib/mysql');

router.get('/', function(req, res, next) {
    res.render('board');
});

module.exports = router;