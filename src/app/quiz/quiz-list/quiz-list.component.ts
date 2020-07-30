import {Component, Input, OnInit} from '@angular/core';
import {QuizApiService} from "../../shared/services/quiz-api.service";

@Component({
  selector: 'app-quiz-list',
  templateUrl: './quiz-list.component.html',
  styleUrls: ['./quiz-list.component.css']
})
export class QuizListComponent implements OnInit {
 @Input() quizzes;
  constructor(private quizApiService:QuizApiService) { }

  ngOnInit(): void {

  }

}
