import { Component, OnInit } from '@angular/core';
import {QuizApiService} from "../../shared/services/quiz-api.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-quiz-instructions',
  templateUrl: './quiz-instructions.component.html',
  styleUrls: ['./quiz-instructions.component.css']
})
export class QuizInstructionsComponent implements OnInit {
 quiz_id;
  constructor(private quizApiService:QuizApiService,private router:Router,private route:ActivatedRoute) {

  }

  ngOnInit(): void {
     this.quiz_id=this.route.snapshot.paramMap.get('passCode');
  }
  startQuiz(){
  this.router.navigate(['takequiz', { quiz_id:this.quiz_id}]);
  }
}
