const mongoose=require("mongoose")
const quiz=new mongoose.Schema({
    name:String,
    passCode:String,
    Students:[
        {
            name:String,
            email:String,
            score:Number
        }
    ],
    time:Number
})
const Quiz=mongoose.model('quiz',quiz);


module.exports=Quiz;
