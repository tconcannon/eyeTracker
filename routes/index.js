var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
// app.get('/', function(req, res){
//   res.send('<h1>Hello world</h1>');
// });

module.exports = router;