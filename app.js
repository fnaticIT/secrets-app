const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://Naman_Balai:naman666@cluster0.pblb7.mongodb.net/secretsDB', {useNewUrlParser: true, useUnifiedTopology: true});
//const ejsLint = require('ejs-lint');
const app = express();

const groupSchema = new mongoose.Schema({
  title:String,
  descrip:String,
  secret:[String],
});

// const secretSchema = new mongoose.Schema({
//   author:String,
//   descrip:String,
//
// });
const Group = mongoose.model("Group",groupSchema);
//const Secret = mongoose.model("Secret",secretSchema);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
const group1=new Group({
  title:"The General Group",
  descrip:"Here you can share anything.",
});
const group2=new Group({
  title:"School shots",
  descrip:"Reveal your darkest and deepest school secrets.",
});
const group3=new Group({
  title:"Exes are SH#T",
  descrip:"Wanna bitch about your ex ,this is the place.",
});
const defaultGroups=[group1,group2,group3];
Group.insertMany(defaultGroups,function (err) {
  if(err){
    console.log(err);
  }
  else{
    console.log("success");
  }
})
app.get('/',function (req,res) {
  Group.find({},function (err,groups) {
    res.render('home',{groups:groups});
  });

});

app.get('/compose',function (req,res) {
  res.render('compose');
});
app.post('/compose',function(req,res){
  const group=new Group({
    title:req.body.title,
    descrip:req.body.descrip,
  });
  group.secret.push(req.body.secret);
  group.save(function (err) {
    if(!err){
      res.redirect('/');
    }
  });
});

app.get('/groups/:groupid',function(req,res) {
  const gid=req.params.groupid;
  Group.findOne({_id:gid},function (err,group) {
      res.render('group',{title:group.title,descrip:group.descrip,_id:gid,secret:group.secret});
  });
});
app.post('/groups',function(req,res) {
  id=req.body.gid;
  Group.findOne({_id:id},function (err,group) {
      console.log(group);
      group.secret.push(req.body.de);
      group.save();
    //  const s="groups"+id
      res.redirect(`groups/${id}`)
console.log(group);
  });
});
 app.get('/search',function (req,res) {
   Group.find({},function (err,groups) {
     res.render('search',{groups:groups});
 });
});
 app.get('/groups',function (req,res) {
   Group.find({},function (err,groups) {
     res.render('groups',{groups:groups});
   });

 });
 let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function() {
  console.log("Server started on port");
});
