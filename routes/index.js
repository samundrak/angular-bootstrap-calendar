var express = require('express');
var router = express.Router();
var plural = require('./Plural');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/connect',plural.connect);
module.exports = router;
