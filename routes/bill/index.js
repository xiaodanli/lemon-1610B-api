var mymongo = require('mymongo1610');

var mongo = require('mymongo1610/utils/getCollection.js');

//添加账单
function addBill(req,res,next){
    var params = req.body,
        timer = params.timer,
        uid = params.uid,
        icon = params.icon,
        intro = params.intro,
        type = params.type,
        money = params.money,
        cid = params.cid;

    if(!timer || !uid || !icon || !intro || !type || !money || !cid){
        return res.json({code:3,msg:'丢失参数'})
    }

    mymongo.find('userlist',{_id:uid},function(error,results){
        if(error){
            res.json({code:0,msg:error})
        }else{
            if(results.length){
                isHasClassify();
            }else{
                res.json({code:0,msg:'没有此用户'})
            }
        }
    })

    function isHasClassify(){
        mymongo.find('classify-list',{_id:cid},function(error,results){
            if(error){
                res.json({code:0,msg:error})
            }else{
                if(results.length){
                    addBillFun();
                }else{
                    res.json({code:0,msg:'没有此分类'})
                }
            }
        })
    }

    function addBillFun(){
        mymongo.insert('bill',{uid:uid,timer:new Date('2018-12-16'),icon:icon,intro:intro,type:type,money:money},function(error,results){
            if(error){
                res.json({code:0,msg:error})
            }else{
                res.json({code:0,msg:'添加账单成功'})
            }
        })
    }   
}


/*
    获取账单

    分两大种情况：

    1>按年 + 分类查询

    2>按月 + 分类查询
*/

function getBill(req,res,next){
    var params = req.query,
        uid = params.uid,
        timer = params.timer,
        intros = JSON.parse(params.intros);

    if(!uid || !timer || !intros){
        return res.json({code:0,msg:'丢失参数'})
    }

    var bigTimer = null;

    if(timer.indexOf('-') != -1){
        //说明按月查
        var timerArr = timer.split('-');
        if(timerArr[1] == '12'){
            bigTimer = (timerArr[0]*1+1)+'-01';
        }else{
            bigTimer = timerArr[0]+'-'+ (timerArr[1]*1+1);
        }
    }else{
        //说明按年查
        bigTimer = timer*1+1+'';    
    }

    mongo('bill',function(error,db,cols){
        if(error){
            res.json({code:0,msg:error})
        }else{
            cols.find({$and:[{timer:{"$lt":new Date(bigTimer),"$gte":new Date(timer)}},{intro:{$in:intros}}]}).sort({timer:-1}).toArray(function(error,results){
                if(error){
                    res.json({code:0,msg:error})
                }else{
                    res.json({code:1,msg:results})
                }
                db.close();
            })
        }
    })    
}

module.exports = {
    addBill:addBill,
    getBill:getBill
}