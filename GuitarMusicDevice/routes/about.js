var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    if(req.session.logined)
      var login = true;
    else
      var login = false;
    res.render('aboutus', {isLogined : login});
});

module.exports = router;