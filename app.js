//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser:true})
const ArticleSchema={
    title:String,
    content:String
}
const Article = mongoose.model("Article",ArticleSchema);
//also we can use chaining route handlers using express
///////////////////////////////////////////////////////////////////FOR ALL DATAS//////////////////////////////////////////////////////////////
app.route("/article").get((req,res)=>{
    Article.find((err,doc)=>{
        if(!err){
            res.send(doc);

        }else{
            res.send(err)
        }
  
    })
}).post((req,res)=>{

    const putArticle = new Article({
        title:req.body.title,
        content:req.body.content
    });
    putArticle.save(function(err){
        if(!err){
            res.send("there is no error log")
        }else{
            res.send("there is an error in saving")
        }
    });
}).delete(
    (req,res)=>{
        Article.deleteMany((err,doc)=>{
            if(!err){
                res.send("the items deleted successfully")
            }else{
                res.send(err)
            }
        })
    }
);
////////////////////////////////////////////////////FOR SPECIFIC DATAS////////////////////////////////////////////////////////////////////////////////////////////
app.route("/article/:articleTitle").get(function(req,res){
    Article.findOne({title:req.params.articleTitle},(err,doc)=>{
        if(!err){
            res.send(doc);
        }else{
            res.send(err);
        }
    })
})
.put(function(req, res){

    Article.update(
      {title: req.params.articleTitle},
      {title: req.body.title, content: req.body.content},
      {overwrite: true},
      function(err){
        if(!err){
          res.send("Successfully updated the selected article.");
        }
      }
    );
  })
  
  .patch(function(req, res){
  
    Article.update(
      {title: req.params.articleTitle},
      {$set: req.body},
      function(err){
        if(!err){
          res.send("Successfully updated article.");
        } else {
          res.send(err);
        }
      }
    );
  })
  
  .delete(function(req, res){
  
    Article.deleteOne(
      {title: req.params.articleTitle},
      function(err){
        if (!err){
          res.send("Successfully deleted the corresponding article.");
        } else {
          res.send(err);
        }
      }
    );
  });
  

app.listen(3000, function() {
  console.log("Server started on port 3000");
});