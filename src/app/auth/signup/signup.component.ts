import { Component, OnInit } from '@angular/core';
import {FormGroup,FormBuilder,Validators} from "@angular/forms";
import {AuthService} from "../../shared/services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  submitted = false;
  constructor(private formBuilder: FormBuilder,private auth:AuthService,private router:Router) { }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email,Validators.pattern(/^([\w\.\-]+)@([\w\-]+)\.([a-z]{2,3})(\.[a-z]{2,3})?$/)]],
      password: ['', [Validators.required, Validators.minLength(6),Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*])(?=.*[0-9])(?!.*\s).{8,}$/)]]
    });
  }
  get f() { return this.signupForm.controls; }
  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.signupForm.invalid) {
      return;
    }
    this.auth.signUp(this.signupForm.value).subscribe(res=> {
      document.getElementById('success').innerText=res["message"];
      setTimeout(()=>this.navigateTologin(),500);
    },(error )=>{document.getElementById('error').innerText= error.error.message});
  }

  clearError(){
    document.getElementById('error').innerText='';
  }
  navigateTologin(){
    this.router.navigateByUrl('/login').then(
      ()=>console.log('in login')
    )
  }
}
