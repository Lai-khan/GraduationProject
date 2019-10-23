var express = require('express');
var router = express.Router();
var db = require('../lib/mysql');

router.get('/?:musicName', function(req, res, next) {
    //  DB Query
});

module.exports = router;