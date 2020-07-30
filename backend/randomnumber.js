function getRandomNumber(min,max){
    let length=max-min+1;
    return Math.floor(Math.random()*length)+min;
}
function createArrayOfNumbers(start,end){
    let myArray=[];
    for(let i=start;i<=end;i++){
        myArray.push(i);
    }
    return myArray;
}
let numbersArray=createArrayOfNumbers(1,4);
function generateRandomNumber(){
    let randomIndex=getRandomNumber(0,numbersArray.length-1);
    let randomNumber=numbersArray[randomIndex];
    numbersArray.splice(randomIndex,1);
    return randomNumber;
}
