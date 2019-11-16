var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.logined)
    var login = true;
  else
    var login = false;
  res.render('index', {isLogined : login});
});

module.exports = router;
