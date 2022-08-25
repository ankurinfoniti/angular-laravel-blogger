import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';
import { ApiError } from '../../models/apierror';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  returnUrl: string = '';
  error!: ApiError;
  loginError: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.authService.logout();
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit() {
    this.submitted = true;
    this.authService
      .login(this.username?.value, this.password?.value)
      .subscribe({
        next: (data) => {
          if (this.authService.isLoggedIn()) {
            let redirect = '';

            if (this.authService.redirectUrl) {
              redirect = this.authService.redirectUrl;
            } else {
              redirect = this.authService.redirectTo();
            }
            this.router.navigate([redirect]);
          } else {
            this.loginError = data.message;
          }
        },
        error: (error) => (this.error = error),
      });
  }
}
