import {Component, Input, OnInit} from '@angular/core';
import {QuizApiService} from "../../shared/services/quiz-api.service";


@Component({
  selector: 'app-questions-list',
  templateUrl: './questions-list.component.html',
  styleUrls: ['./questions-list.component.css']
})
export class QuestionsListComponent implements OnInit {
   @Input() questions;
  quiz_id="12345"
  constructor(private quizApiService:QuizApiService) { }


  ngOnInit(): void {

  }

}
