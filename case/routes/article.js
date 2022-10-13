let express = require('express');
let router = express.Router();

const db=require('../utils/db');
const multer=require('multer');
const fs=require('fs');
const moment=require('moment');

router.post('/add',(req,res)=>{
    let sql="insert into article(title,summary,content,cate_id,create_time) value(?,?,?,?,?)"
    let {title,summary,content,cate_id}=req.body
    let create_time=new Date()
    db.query(sql,[title,summary,content,cate_id,create_time],(err,data)=>{
        if (err){
            console.log(err)
            return
        }else {
            res.json(data)
        }
    })
})


router.get('/delImage',(req,res)=>{
    let url=(req.query[0]).split('/')
    let path=url[url.length-2]+'/'+url[url.length-1]
    if(req.query[0]){
        fs.unlink('./public/article/${path}',err=>{
            if(err){
                console.log(err)
                return
            }else{
                res.send({flag:true,msg:'删除成功'})
            }
        })
    }
})

router.get('/getArticle/', (req, res, next) => {
    let sql="select * from article order by id desc limit 1"
    db.query(sql,[],(err,data)=>{
        if(err){
            res.send({flag: false, msg: '查询出错'})
        }else if(data.length!==0){
            res.send({flag: true,data:data})
        }
    })
})

module.exports=router;