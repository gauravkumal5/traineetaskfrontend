import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from "rxjs";
import { AuthResponseData, AuthService } from '../services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  message: string;
  loginForm!: FormGroup
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      'username': new FormControl(null, [Validators.required]),
      'password': new FormControl(null, [Validators.required]),
    })
  }

  onSubmit() {
    console.log(this.loginForm);
    if (!this.loginForm.valid) {
      console.log("form not valid");
      return;
    }
    let authObs: Observable<AuthResponseData>;
    authObs = this.authService.login(this.loginForm.value.username, this.loginForm.value.password);
    authObs.subscribe(response => {
      if (response.jwtToken != undefined) {

        sessionStorage.setItem('token', response.jwtToken);
        this.router.navigate(['customers']);
      }
    },
      (errorMessage) => {
        this.message = errorMessage;
        console.log(errorMessage);

      }
    )
  }
}
