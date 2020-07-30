import { Component, OnInit } from '@angular/core';
import {QuizApiService} from "../../shared/services/quiz-api.service";

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {
  quiz=<any>{};
  quizCopy=Object.assign({},this.quiz);
  quizzes;
  key;
  constructor(private quizApiService:QuizApiService) { }

  post(){
    this.quizApiService.postQuiz(this.quizCopy).subscribe(
      (data)=>{
        document.getElementById('success').innerText=data['message'];
        setTimeout(this.clearMessages,2000);
        this.loadQuiz();
        this.new();
      },
      error => {
        document.getElementById('error').innerText=error.error.message;
      }
    )
  }
  getQuizzes(){
    this.quizApiService.getQuizzes().subscribe(
      res=>{
        this.quizzes=res['quizzes'];
        this.quizApiService.syncQuizzesDetails(this.quizzes);
      }
    )
  }
  clearMessages(){
    document.getElementById('success').innerText='';
    document.getElementById('error').innerText='';
  }
  update(){
    this.quizApiService.updateQuiz(this.quizCopy,this.quiz).subscribe(
      (data)=>{
        document.getElementById('success').innerText=data['message'];
        setTimeout(this.clearMessages,2000);
        this.loadQuiz();
        this.new();
      },
      error => {
        document.getElementById('error').innerText=error.error.message;
      }
    )
  }
  Delete(){
    this.quizApiService.deleteQuiz(this.quizCopy).subscribe(
      (data)=>{
        document.getElementById('success').innerText=data['message'];
        setTimeout(this.clearMessages,2000);
        this.loadQuiz();
        this.new();},
      error => {
        document.getElementById('error').innerText=error.error.message;
      }
    )
  }
  new(){
    this.quizCopy=<any>{};

  }
  loadQuiz(){
    this.getQuizzes()

  }
  ngOnInit(): void {
    this.quizApiService.quizSelected.subscribe(
      (quiz)=> {
        this.quiz = quiz;
        this.quizCopy=Object.assign({},this.quiz);
      }

    )
    this.loadQuiz()
  }
  FieldsChange(event){
    console.log('here');
    console.log(event.checked);
    this.quizCopy.time=null;
  }


}
