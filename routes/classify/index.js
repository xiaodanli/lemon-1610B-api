var mymongo = require('mymongo1610');

//获取分类图标
function getIcon(req,res,next){
    mymongo.find('iconlist', function (err, result) {
        if(err){
            res.json({code:0,msg:err})
        }else{
            res.json({code:1,data:result})
        }
    });
}

//添加分类
var addClassify = function(req,res,next){
    var params = req.body,
        intro = params.intro,
        icon = params.icon,
        uid = params.uid,
        type = params.type;

    if(!intro || !icon || !uid || !type){
        return res.json({code:0,msg:'丢失参数'})
    }

    //如果添加的分类，成员不在我们的用户列表里，就不让添加

    mymongo.find('userlist',{_id:uid},function(error,results){
        if(error){
            res.json({code:0,msg:error})
        }else{
            if(results.length){
                selectClassify();
            }else{
                res.json({code:0,msg:'没有此用户'})
            }
        }
    })

    function selectClassify(){
        mymongo.find('classify-list', {$and:[{intro:intro},{type:type},{uid:{$in:['*',uid]}}]}, function (error, result) {
            if(error){
                res.json({code:0,msg:error})
            }else{
                if(result.length){
                    res.json({code:3,msg:'此分类已存在'})
                }else{
                    addClassify();
                }
            }
        });
    }

    function addClassify(){
        mymongo.insert('classify-list', {intro:intro,type:type,uid:uid,icon:icon}, function (error) {
            if(error){
                res.json({code:0,msg:error})
            }else{
                res.json({code:0,msg:'添加成功'})
            }
        });
    }
}

//获取分类
var getClassify = function(req,res,next){
    var uid = req.query.uid;
    mymongo.find('classify-list', {$or:[{uid:'*'},{uid:uid}]}, function (err, result) {
        if(err){
            res.json({code:0,msg:err})
        }else{
            res.json({code:1,data:result})
        }
    });
}

module.exports = {
    getIcon:getIcon,
    addClassify:addClassify,
    getClassify:getClassify
}