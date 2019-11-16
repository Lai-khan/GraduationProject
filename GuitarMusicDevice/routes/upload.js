var express = require('express');
var router = express.Router();
var db = require('../lib/mysql');

var multer = require('multer');
var g_filename = '';

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
        console.log("up_date: " + date);
        g_filename = dateToString(date) + '_' + file.originalname;
        console.log("filename: " + g_filename);
        callback(null, g_filename);
    }
})

let upload = multer({
    storage: storage
})

router.get('/', function(req, res, next) {
    res.render('upload');
    // if(req.session.logined){ res.render('upload'); }
    // else{ res.render( 'upload_before'); }
});

router.post('/process', upload.single('gpfile'), function(req, res, next){
    // 일단 login_id 는 더미값으로 조정
    var title = req.body.musicTitle;
    console.log('title     : ' + title);
    //console.log('userid    : ' + req.session.user_id);
    console.log('userid    : ' + 'ignored');

    // insert into board
    var sql = `
    INSERT INTO board(title, name)
    VALUES('${title}', 'temporary')
    `;

    db.query(sql, function(err, result) {
        if(err) next(err);
        else {
            //console.log('b_insert  : ' + result);

            // extract idx(maximum value)
            var sql = `
            SELECT * FROM board
            WHERE title = '${title}'
            AND name = 'temporary'
            `

            db.query(sql, function(err, rows) {
                if(err) next(err);
                console.log("===rows===");
                console.log(rows)
                console.log("==========");
                var idx = rows[rows.length - 1]["idx"];
                console.log("idx       : " + idx);
                console.log("g_filename: " + g_filename);
                
                // insert into music
                var sql = `
                INSERT INTO music(idx, title, filename)
                VALUES(${idx}, '${title}', '${g_filename}')
                `
                // 경로가 없는 순수 파일 이름. 경로가 필요하다면 앞에 upload .. 를 문자열 결합할

                db.query(sql, function(err, result) {
                    if(err) next(err)
                    else {
                        res.redirect(`/guitar/${idx}`);
                    }
                });
            });
        }
    });
});

module.exports = router;