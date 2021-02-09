const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));

app.set("view engine", "ejs");

app.use(express.static("public"));
mongoose.connect('mongodb://localhost:27017/wikiDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const articleSchema = {
  title: String,
  content: String
}

const Article= mongoose.model("Article", articleSchema);

////////////////////Requests Targetting all Articles//////////////////////


app.route("/articles").get(function(req,res){
Article.find(function(err,articlesFound){

if(!err){
    res.send(articlesFound);
}else{
  res.send(err)
}

});

}).post(function(req,res){

const callback= new Article({
  title:req.body.title,
  content:req.body.content});

callback.save(function(err){

if(!err){
  res.send("successfully added a new article.");
}else{

  res.send(err);
}

});
}).delete(function(req,res){

Article.deleteMany(function(err){

  if(!err){
    res.send("Successfully deleted all the articles!")
  }else{
    res.send(err);
  }
});


});

////////////////////Requests Targetting A Specific Article//////////////////////

app.route("/articles/:articleTitle")

.get(function(req,res){

Article.findOne({title:req.params.articleTitle},function(err,foudArticle){

if(foudArticle){

  res.send(foudArticle);
}else{

  res.send("no articles matching that title was found.")
}
})

})

.put(function(req,res){
Article.update({title:req.params.articleTitle},{title:req.body.title, content:req.body.content},{overwrite:true},function(err){
if(!err){

  res.send("The article is successfully updated!") }else{
    res.send(err);
  }


})


})

.patch(function(req,res){

Article.update({title:req.params.articleTitle},{$set:req.body},function(err){

if(!err){

  res.send("the article is successfully updated.")
}else{

  res.send(err);
}

})

})

.delete(function(req,res){

Article.deleteOne({title:req.params.articleTitle},function(err){

  if(!err){
    res.send("The article is successfully deleted.")
  }else{

    res.send(err)
  }
})

})



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
