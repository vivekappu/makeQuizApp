import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../shared/services/auth.service";
import {Router} from "@angular/router";
import {QuizApiService} from "../../shared/services/quiz-api.service";

@Component({
  selector: 'app-quiz-entry',
  templateUrl: './quiz-entry.component.html',
  styleUrls: ['./quiz-entry.component.css']
})
export class QuizEntryComponent implements OnInit {
  quizEntryForm: FormGroup;
  submitted = false;
  constructor(private formBuilder: FormBuilder,private quizApiService:QuizApiService,private router:Router) { }

  ngOnInit(): void {
    this.quizEntryForm = this.formBuilder.group({
      passCode: ['', [Validators.required]],

    });
  }
  get f() { return this.quizEntryForm.controls; }
  clearError(){
    document.getElementById('error').innerText='';
  }
  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid

    if (this.quizEntryForm.invalid) {
      return;
    }
    this.quizApiService.enterQuiz(this.quizEntryForm.value.passCode).subscribe(res=> {
      console.log(res);
      console.log(res['error']!=undefined);
         if(res['error']!=undefined){
             document.getElementById('error').innerText=res['error'];
         } else {
           let passCode = res['data'].passCode;

           this.router.navigate(['quizInstructions', {  passCode:passCode}]);
         }

    },error =>{ document.getElementById('error').innerText=error.error.message;})
  }
}
