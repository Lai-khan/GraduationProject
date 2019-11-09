var express = require('express');
var router = express.Router();
var db = require('../lib/mysql');

var multer = require('multer');

let storage = multer.diskStorage({
    destination: function(req, file, callback){
        callback(null, './uploads');
    },
    filename: function(req, file, callback){
        callback(null, file.originalname);
    }
})

let upload = multer({
    storage: storage
})

router.get('/', function(req, res, next) {
    res.render('upload2');
});

router.post('/process', upload.single('gpfile'), function(req, res, next){
    res.send('uploaded file <br />' + req.file);
    console.log(req.file);
});

module.exports = router;