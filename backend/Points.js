function calculatePoints(questionArray,answerArray){
    let points=0;

    questionArray.forEach(
        (q)=>{
            answerArray.forEach(
                (a)=>{
                    if(a._id==q._id){
                        if(a.selectedAnswer==q.correctAnswer){
                            points+=q.points;
                        }
                    }
                }
            )
        }
    )
    return points;
}
module.exports=calculatePoints;
