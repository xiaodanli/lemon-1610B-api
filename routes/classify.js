var express = require('express');
var router = express.Router();

var classifyApi = require('./classify/index.js');

//获取分类图标列表
router.get('/api/iconlist',classifyApi.getIcon);

//添加分类
router.post('/api/addClassify',classifyApi.addClassify);

//查询分类
router.get('/api/getClassify',classifyApi.getClassify);

module.exports = router;