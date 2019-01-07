var express = require('express');
var router = express.Router();
var userApi = require('./users/index.js');

console.log(userApi);
/* GET users listing. */
router.get('/api/addUser',userApi);

module.exports = router;

