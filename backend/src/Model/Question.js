const mongoose=require("mongoose")
const questionModel=new mongoose.Schema({
    title:String,
    correctAnswer: String,
    option1:String,
    option2:String,
    option3:String,
    points:Number
})



module.exports=questionModel;
