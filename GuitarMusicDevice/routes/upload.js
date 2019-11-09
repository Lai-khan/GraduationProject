var express = require('express');
var router = express.Router();
var db = require('../lib/mysql');

var multer = require('multer');

var formatTwo = (n) => {
    n = (n < 10) ? '0' + n : n;
    return n;
}

var dateToString = (d) => {
    console.log(d);
    console.log(d.getFullYear());
    console.log(formatTwo(d.getFullYear()));
    var str = '' + 
    d.getFullYear() +
    formatTwo(d.getMonth() + 1) +
    formatTwo(d.getDay()) +
    '_' +
    formatTwo(d.getHours()) +
    formatTwo(d.getMinutes()) +
    formatTwo(d.getSeconds());
    return str;
}

let storage = multer.diskStorage({
    destination: function(req, file, callback){
        callback(null, './public/files');
    },
    filename: function(req, file, callback){
        var date = new Date();
        console.log(date);
        callback(null, dateToString(date) + '_' + file.originalname);
    }
})

let upload = multer({
    storage: storage
})

router.get('/', function(req, res, next) {
    res.render('upload');
});

router.post('/process', upload.single('gpfile'), function(req, res, next){
    res.send('uploaded file <br />' + req.file);
    console.log(req.file);
});

module.exports = router;