var express = require('express');
var router = express.Router();
var db = require('../lib/mysql');

router.get('/login', function(req, res, next) {
    res.render('login');
});

router.get('/login/process', function(req, res, next) {
    res.redirect();
});

router.get('/logout', function(req, res, next) {
    res.redirect();
});

router.get('/signup', function(req, res, next) {
    res.render('signup');
});

router.get('/signup/process', function(req, res, next) {
    res.redirect();
});

module.exports = router;