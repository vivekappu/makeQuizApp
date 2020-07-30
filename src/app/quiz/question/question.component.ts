import { Component, OnInit } from '@angular/core';
import {QuizApiService} from "../../shared/services/quiz-api.service";
import {FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {
 question=<any>{};
 questionCopy=Object.assign({},this.question);
 questions;
 quiz_id;
 quizzes;
 quizControl = new FormControl('', Validators.required);

  constructor(private quizApiService:QuizApiService) { }

  ngOnInit(): void {
    this.loadQuestions();
    this.quizApiService.questionSelected.subscribe(
      (question)=>{
        this.question=question;
        this.questionCopy=Object.assign({},this.question);
        }
    )
    this.loadQuizzes();
    this.quizApiService.QuizzesSynced.subscribe(
      quizzes=>
      {
        this.quizzes=quizzes;
        console.log(quizzes);
      }
    )
  }
  post(){
    console.log('here')
    this.quizApiService.postQuestion(this.questionCopy,this.quiz_id).subscribe(
      (data)=>{
        document.getElementById('success').innerText=data['message'];
        setTimeout(this.clearMessages,2000);
        this.loadQuestions();
        this.new();
      },error => {
        document.getElementById('error').innerText=error.error.message;
      }
    )
  }
  update(){
    this.quizApiService.updateQuestion(this.questionCopy,this.quiz_id).subscribe(
      (data)=>{
        document.getElementById('success').innerText=data['message'];
        setTimeout(this.clearMessages,2000);
        this.loadQuestions();
        this.new()
      },error => {
        document.getElementById('error').innerText=error.error.message;
      }
    )
  }
  Delete(){
    this.quizApiService.deleteQuestion(this.questionCopy,this.quiz_id).subscribe(
      (data)=>{
        document.getElementById('success').innerText=data['message'];
        setTimeout(this.clearMessages,2000);
        this.loadQuestions();
        this.new();
      },
      error => {
        document.getElementById('error').innerText=error.error.message;
      }
    )
  }
  new(){
    this.questionCopy=<any>{};
  }
  getQuestions(){
    this.quizApiService.getQuestions(this.quiz_id).subscribe(
      res=> {
        this.questions = res['questions'];
        console.log(this.questions)
      }
    );
  }
  getQuizzes(){
    this.quizApiService.getQuizzes().subscribe(
      res=>{
        this.quizzes=res['quizzes']
      }
    )
  }
  loadQuestions(){
    this.getQuestions();
  }
  loadQuizzes(){
    this.getQuizzes();
  }
  /* on select event change load questions*/
  onChange(event){
    this.loadQuestions()
    console.log('event trigerred');
  }
  clearMessages(){
    document.getElementById('success').innerText='';
    document.getElementById('error').innerText='';
  }
}
