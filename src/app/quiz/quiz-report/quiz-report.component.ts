import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {QuizApiService} from "../../shared/services/quiz-api.service";
import {FormControl, Validators} from "@angular/forms";

export interface UserReport {
  name: string;
  email: string;
  score: number;
}
let userReport:UserReport[]=[
];


@Component({
  selector: 'app-quiz-report',
  templateUrl: './quiz-report.component.html',
  styleUrls: ['./quiz-report.component.css']
})

export class QuizReportComponent implements OnInit {
  displayedColumns: string[] = ['name','email','score'];
  dataSource=new MatTableDataSource(userReport);
  quizDetails;
  quizzes;
  quiz_id;
  quizControl = new FormControl('', Validators.required);
  constructor(private quizApiService:QuizApiService) { }

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  loadQuizzes(){
    this.getQuizzes();
  }
  getQuizzes(){
    this.quizApiService.getQuizzes().subscribe(
      res=>{
        this.quizzes=res['quizzes']
      }
    )
  }
  ngOnInit() {
    this.loadQuizzes()
    this.dataSource.sort = this.sort;
    this.quizApiService.QuizzesSynced.subscribe(
      quizzes=>
      {
        this.quizzes=quizzes;
        console.log(quizzes);
      }
    )
  }
  getQuizDetails(){
    this.quizDetails=this.quiz_id;
    this.quizApiService.getQuizDetails(this.quizDetails.passCode).subscribe(
      (res)=>{
        console.log(res['quizDetails']);
        this.quizDetails=res['quizDetails'];
        this.quizDetails.Students.forEach(

          user=>{
            userReport.push(
              {
                'name':user.name,
                'email':user.email,
                'score':user.score
              }
            )
          }
        )
        this.dataSource=new MatTableDataSource(userReport);
        this.dataSource.sort = this.sort;
      }
    )
  }

  onChange($event){
    userReport=[];
     this.getQuizDetails();
    console.log('event trigerred');
  }
}
