import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from "./auth/login/login.component";
import {IndexComponent} from "./index/index.component";
import {SignupComponent} from "./auth/signup/signup.component";
import {AuthGuard} from "./shared/services/auth.guard";
import {QuestionComponent} from "./quiz/question/question.component";
import {QuizComponent} from "./quiz/quiz/quiz.component";
import {TakequizComponent} from "./quiz/takequiz/takequiz.component";
import {HomeComponent} from "./home/home.component";
import {QuizEntryComponent} from "./quiz/quiz-entry/quiz-entry.component";
import {QuizInstructionsComponent} from "./quiz/quiz-instructions/quiz-instructions.component";


const routes: Routes = [
  {
    path:'',
    component:HomeComponent
  },
  {
    path:'createQuiz',
    component:IndexComponent
  },
  {
    path:'attemptQuiz',
    component:QuizEntryComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path:'signup',
    component:SignupComponent
  },
  {
    path:'question',
    component:QuestionComponent,
    canActivate:[AuthGuard]
  },
  {
    path:'quizInstructions',
    component:QuizInstructionsComponent
  },
  {
    path:'takequiz',
    component:TakequizComponent
  },
  {
    path:'quiz',
    component:QuizComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
