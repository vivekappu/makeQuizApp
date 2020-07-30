import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Subject} from "rxjs";
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class QuizApiService {
  private selectedQuestion=new Subject<any>();
  private selectedQuiz=new Subject<any>();
  private takenQuiz=new Subject<any>();
  private syncQuizzes=new BehaviorSubject<any>(null);
  quizTaken=this.takenQuiz.asObservable();
  questionSelected=this.selectedQuestion.asObservable();
  quizSelected=this.selectedQuiz.asObservable();
  baseUrl='http://localhost:3000';
  QuizzesSynced=this.syncQuizzes.asObservable();
  constructor(private http:HttpClient) { }
  postQuestion(question,quiz_id){
    return this.http.post(`${this.baseUrl}/addQuestion`,{question:question,quiz_id:quiz_id})
  }
  getQuestions(quiz_id){
    return this.http.get(`${this.baseUrl}/${quiz_id}/questions`)
  }
  getQuestionsForQuiz(quiz_id){
    return this.http.get(`${this.baseUrl}/takeQuiz/${quiz_id}/questions`)
  }
  updateQuestion(question,quiz_id){
    return this.http.put(`${this.baseUrl}/editQuestion`,{question:question,quiz_id:quiz_id})
  }
  deleteQuestion(question,quiz_id){
    return this.http.post(`${this.baseUrl}/deleteQuestion`,{question:question,quiz_id:quiz_id})
  }
  updateQuiz(quizUpdate,quizPrev){
    return this.http.put(`${this.baseUrl}/editQuiz`,{quizPrev:quizPrev,quizUpdated:quizUpdate})
  }
  selectQuestion(question){
    this.selectedQuestion.next(question);
  }
  selectQuiz(quiz){
    this.selectedQuiz.next(quiz);
  }
  syncQuizzesDetails(quiz){
    this.syncQuizzes.next(quiz);
  }
  getQuizDetails(passCode){
    return this.http.get(`${this.baseUrl}/getQuiz/${passCode}`)
  }
  deleteQuiz(quiz){
    console.log(quiz);
    return this.http.delete(`${this.baseUrl}/deleteQuiz/${quiz.passCode}`)
  }
  postQuiz(quiz){
    return this.http.post(`${this.baseUrl}/addQuiz`,quiz);
  }
  getQuizzes(){
    return this.http.get(`${this.baseUrl}/quizzes`)
  }
  submitQuiz(quiz_id,questions){
    return this.http.post(`${this.baseUrl}/takeQuiz/${quiz_id}/submitQuiz`,questions)
  }
  enterQuiz(passCode){
    return this.http.get(`${this.baseUrl}/enterQuiz/${passCode}`);
  }

}
