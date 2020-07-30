const mongoose=require("mongoose")
const user=new mongoose.Schema({
    fname:String,
    lname:String,
    email:String,
    password:String,
    quizzes:[
        {
            name:String,
            passCode:String,
            time:Number
        }
    ]
})
const User=mongoose.model('user',user);
module.exports=User;
