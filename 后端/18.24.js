var express = require('express');
var app = express();
var imf;
app.use('/public', express.static('public'));
 
app.get('/index.html', function (req, res) {
   res.sendFile('C:/Users/Administrator/Desktop/openresty-1.19.3.1-win64/html/index.html');
})


//引入mongoose
var mongoose=require("mongoose");
const { stringify } = require('querystring');
mongoose.connect('mongodb://localhost:27017/mongoose_test', {useNewUrlParser: true, useUnifiedTopology: true});
const { Schema } = mongoose;



//创建学生模板
const stuSchema = new Schema({
     classNumber:String,
     yourName:String,
     action:String,
     type:String
});
const ClassStudent = mongoose.model('classStudent', stuSchema);




//创建学生信息录入模板
const imSchema = new Schema({
    title:String,
    content:String,
    userInfo:String,
    time:String,
    target:String
});
const Imformation = mongoose.model('imformation', imSchema);


//创建学生忙碌时间模板
const busySchema = new Schema({
    classNumber:String,
    yourName:String,
    yourBusyTime:String
});
const BusyNumber = mongoose.model('busyNumber', busySchema);
 

//关于记录学生信息的
app.get('/student_get', function (req, res) {
    var express=new ClassStudent({
       classNumber:req.query.classNumber,
       yourName:req.query.yourName,
       action:"0",
       type:"0"
    })
    express.save(function(){
        console.log("保存成功")
    })
 
   // 控制台输出 JSON 格式
   var response01 = {
       "classNumber":req.query.classNumber,
       "yourNamee":req.query.yourName
   };
   console.log(response01);
   res.end(JSON.stringify(response01));
})


//关于记录通知消息的
app.get('/imforamtion_get', function (req, res) {
    var str = req.query.target;
    var m = str.split(",");
    var arr = str.match(/[,，]/g);
    if(arr)
    var num2;
    num2 = arr.length;

    for(var i=0;i<num2;i++){
    var express=new Imformation({
        title:req.query.title,
        content:req.query.content,
        userInfo:req.query.userInfo,
        time:req.query.time,
        target:m[i]
    })
    express.save(function(){
        console.log("保存成功")
    })
    }
 
// 控制台输出 JSON 格式
   var response02 = {
       "title":req.query.title,
       "content":req.query.content,
       "userInfo":req.query.userInfo,
       "time":req.query.time
   };
   console.log(response02);
   res.end(JSON.stringify(response02));
})

//关于记录学生在工作的人数
app.get('/studentNumberswork_get', function (req, res) {
    ClassStudent.count({classNumber:req.query.classNumber,action:"开始",type:"work"},function (err , count) {
        if(!err){
            imf=count
            console.log(count);
            res.end(JSON.stringify(imf));
        }
        
    }); 

})

//关于记录学生在休息的人数
app.get('/studentNumbersrest_get', function (req, res) {
    ClassStudent.count({classNumber:req.query.classNumber,action:"开始",type:"rest"},function (err , count) {
        if(!err){
            imf=count
            console.log(count);
            res.end(JSON.stringify(imf));
        }
        
    }); 

})


//获取通知
app.get('/imforamtion_check', function (req, res) {
    Imformation.find({target:req.query.target},{_id:0,_v:0},function (err , docs) {
        if(!err){
            imf=docs;
            res.send(imf);
            console.log(imf);
            
           
        }
    })
    
 })



 //获取学生是否忙碌
 app.get('/number_check', function (req, res) {
    ClassStudent.updateOne({yourName:req.query.userInfo},{$set:{action:req.query.action,type:req.query.type}},function (err) {
        if(!err){
            console.log("修改成功");
        }
    });
    var response02 = {
        "userInfo":req.query.userInfo,
        "action":req.query.action,
        "type":req.query.type
    };
    console.log(response02);
    res.end(JSON.stringify(response02));
    
 })

    
//获取学生名单
app.get('/specific_student', function (req, res) {
    ClassStudent.find({classNumber:req.query.classNumber},{yourName:1 , _id:0},function (err , docs) {
        if(!err){
            imf=docs;
            res.send(JSON.stringify(imf));
            console.log(imf);
            console.log(JSON.stringify(imf));
            }
    })
    
 })

//获取学生班级
app.get('/specific_class', function (req, res) {
    ClassStudent.find({yourName:req.query.yourName},{classNumber:1 , _id:0},function (err , docs) {
        if(!err){
            imf=docs;
            res.send(JSON.stringify(imf));
            console.log(JSON.stringify(imf));
            
           
        }
    })
    
 })

var server = app.listen(8081, function () {
    console.log("成功运行~~~~")
    

})