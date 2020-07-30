import { Component, OnInit } from '@angular/core';
import {AuthService} from "../shared/services/auth.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  IsloggedIn(){

    return this.authService.IsloggedIn();
  }

  title = 'Product Management';
  links = [
    { path: '',  title: 'Home' },
    { path: 'createQuiz',  title: 'createQuiz' },
    { path:'attempQuiz',title:'attemptQuiz'},
    { path: 'login' , title: 'login' },
    { path: 'signup', title: 'signup'},

  ];
  constructor(private authService:AuthService) { }
  logoutUser(){
    this.authService.logoutUser();
  }
  
  ngOnInit(): void {
  }

}
