import { Component, OnInit } from '@angular/core';
import {QuizApiService} from "../../shared/services/quiz-api.service";
import {FinishedDialogComponent} from "../finished-dialog/finished-dialog.component";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ActivatedRoute, Router} from "@angular/router";
@Component({
  selector: 'app-takequiz',
  templateUrl: './takequiz.component.html',
  styleUrls: ['./takequiz.component.css']
})
export class TakequizComponent implements OnInit {
  panelOpenState = false;
  quiz_id ;
  questions;
  totalPoints ;
  config;
  isTimer=false;

  constructor(private quizApiService: QuizApiService,public dialog:MatDialog,private router:Router,private route:ActivatedRoute) {
  }

  getQuestions() {
    let savedQuiz=localStorage.getItem('savedQuiz');
    if(savedQuiz){
      this.questions=JSON.parse(savedQuiz);
      this.totalPoints=parseInt(localStorage.getItem('totalPoints'));
      if(localStorage.getItem('Timer')){
        this.isTimer=true;
      }
    }else {
      this.quizApiService.getQuestionsForQuiz(this.quiz_id).subscribe(
        res => {
          console.log(res);
          this.questions = res['questions'];
          this.totalPoints = res['totalPoints'];
          if(res['time']) {
            this.Timer(res['time']);
            this.isTimer=true;

          }
        }
      );
    }

  }

  submitQuiz() {
    this.quizApiService.quizTaken.subscribe(
      (quiz)=>{
        console.log('here',quiz);
      }
    )
    this.quizApiService.submitQuiz(this.quiz_id, this.questions).subscribe(
      res => {
        this.removeQuiz();
        localStorage.removeItem('Timer');
        if(res['report']) {
          this.openDialog(res['report'].points, this.totalPoints);
        }
        if(res['error']){
           alert(res['error'].message);
           console.log(res['error'])
        }
        this.router.navigateByUrl('/');
      }
    );
  }

  step = 0;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  /*---timer function here---------*/
  addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes*60000);
  }
  Timer(minutes){
    let later=this.addMinutes(new Date,minutes);
    let now=new Date;
    console.log(parseInt(localStorage.getItem('Timer'))/1000);
    let seconds = parseInt(localStorage.getItem('Timer'))/1000||(later.getTime() -now.getTime())/1000;
    this.config={leftTime: seconds,notify:0};
  }
  event(event) {
    console.log(event.left);
    this.store(event.left);
    if(event.action=='done'){
      console.log('done');
      localStorage.removeItem('Timer');
      this.removeQuiz();
      this.submitQuiz();
    }
  }
  saveQuiz(){
    localStorage.setItem('savedQuiz',JSON.stringify(this.questions));
    localStorage.setItem('totalPoints',this.totalPoints);
  }
  removeQuiz(){
    localStorage.removeItem('savedQuiz');
    localStorage.removeItem('totalPoints');
  }

  store(leftTime){
    let key = 'Timer';
    localStorage.setItem(key,leftTime);
  }
  /*---------timer ends--------*/
  ngOnInit(): void {
    this.quiz_id=this.route.snapshot.paramMap.get('quiz_id');
    this.getQuestions();
    if(!!localStorage.getItem('Timer')){
         this.Timer(0);
    }
  }



  openDialog(points,totalPoints) {
    const dialogRef = this.dialog.open(FinishedDialogComponent, {
      width: '500px',
      data: {points, totalPoints}
    });
  }
}
