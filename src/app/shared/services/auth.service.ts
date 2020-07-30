import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl='http://localhost:3000';
  constructor(private http: HttpClient , private router: Router) { }
  signUp(user){
    return this.http.post(`${this.baseUrl}/signUp`,user);
  }
  login(user){
    return this.http.post(`${this.baseUrl}/login`,user)
  }
  IsloggedIn(){
    return !!localStorage.getItem('token')
  }
  getToken(){
    return localStorage.getItem('token')
  }
  getUser(){
    return localStorage.getItem('username');
  }
  logoutUser(){
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.router.navigate(['/login']);
  }

}
