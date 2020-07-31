import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../shared/services/auth.service';
import {Router} from '@angular/router';
import {of, Subscription} from 'rxjs';

import { Injectable } from '@angular/core';
import { JwtHelperService , JWT_OPTIONS } from '@auth0/angular-jwt';
import {delay} from 'rxjs/operators';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
@Injectable({
  providedIn: 'root'
})
export class LoginComponent implements OnInit {
  token;
  loginForm: FormGroup;
  tokenSubscription = new Subscription();
  submitted = false;
  timeout;
  constructor(private formBuilder: FormBuilder, private auth: AuthService, private router: Router, private jwtHelper: JwtHelperService) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^([\w\.\-]+)@([\w\-]+)\.([a-z]{2,3})(\.[a-z]{2,3})?$/)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*])(?=.*[0-9])(?!.*\s).{8,}$/)]]
    });
  }
  get f() { return this.loginForm.controls; }
  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    console.log('login');
    if (this.loginForm.invalid) {
      console.log('here');
      return;
    }

    this.auth.login(this.loginForm.value).subscribe(res => {
      const token = res['token'];
      const username = res['username'];

      this.timeout = this.jwtHelper.getTokenExpirationDate(token).valueOf() - new Date().valueOf();
      document.getElementById('success').innerText = res['message'];
      console.log(this.timeout);
      this.expirationCounter(this.timeout);
      setTimeout(() => this.navigateToHome(token, username), 500);

    }, (error ) => {document.getElementById('error').innerText = error.error.message; });
  }


  expirationCounter(timeout) {
    this.tokenSubscription.unsubscribe();
    this.tokenSubscription = of(null).pipe(delay(timeout)).subscribe((expired) => {
      console.log('EXPIRED!!');

      this.auth.logoutUser();
      this.router.navigate(['/login']);
    });
  }
  navigateToHome(token, username){
    this.router.navigateByUrl('/').then(
      () => {
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);

      }
    );
  }
  // tslint:disable-next-line:typedef
  clearError(){
    document.getElementById('error').innerText = '';
  }

}
