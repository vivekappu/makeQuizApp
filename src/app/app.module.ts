import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { IndexComponent } from './index/index.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from './material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {AuthService} from './shared/services/auth.service';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AuthGuard} from './shared/services/auth.guard';
import { QuestionComponent } from './quiz/question/question.component';
import {QuizApiService} from './shared/services/quiz-api.service';
import { QuestionsListComponent } from './quiz/questions-list/questions-list.component';
import { QuizComponent } from './quiz/quiz/quiz.component';
import { QuizListComponent } from './quiz/quiz-list/quiz-list.component';
import {MatTabsModule} from '@angular/material/tabs';
import {TokenInterceptorService} from './shared/services/token-interceptor.service';
import { TakequizComponent } from './quiz/takequiz/takequiz.component';
import {MatRadioModule} from '@angular/material/radio';
import {MatExpansionModule} from '@angular/material/expansion';
import { FinishedDialogComponent } from './quiz/finished-dialog/finished-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { QuizEntryComponent } from './quiz/quiz-entry/quiz-entry.component';
import { QuizInstructionsComponent } from './quiz/quiz-instructions/quiz-instructions.component';
import { QuizReportComponent } from './quiz/quiz-report/quiz-report.component';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import { CountdownModule } from 'ngx-countdown';
import { FooterComponent } from './footer/footer.component';
import {JWT_OPTIONS, JwtHelperService} from '@auth0/angular-jwt';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    IndexComponent,
    QuestionComponent,
    QuestionsListComponent,
    QuizComponent,
    QuizListComponent,
    TakequizComponent,
    FinishedDialogComponent,
    HomeComponent,
    HeaderComponent,
    QuizEntryComponent,
    QuizInstructionsComponent,
    QuizReportComponent,
    FooterComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        FormsModule,
        MaterialModule,
        ReactiveFormsModule,
        HttpClientModule,
        MatTabsModule,
        MatRadioModule,
        MatExpansionModule,
        MatDialogModule,
        MatSortModule,
        MatTableModule,
        CountdownModule
    ],
  providers: [AuthService, AuthGuard, QuizApiService, {
   provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptorService,
    multi: true
  },
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService
],
  bootstrap: [AppComponent],
  entryComponents: [FinishedDialogComponent]
})
export class AppModule { }
