import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UserService } from '../../services/user.service';
import { ApiError } from '../../models/apierror';
import { UniqueUsername } from '../class/unique-username';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  error!: ApiError;
  submitted = false;

  registrationForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private uniqueUsername: UniqueUsername
  ) {}

  ngOnInit(): void {
    this.registrationForm = this.fb.group(
      {
        name: ['', Validators.required],
        username: [
          '',
          [Validators.required],
          [this.uniqueUsername.validate.bind(this.uniqueUsername)],
        ],
        password: ['', Validators.required],
      },
      { updateOn: 'blur' }
    );
  }

  get name() {
    return this.registrationForm.get('name');
  }

  get username() {
    return this.registrationForm.get('username');
  }

  get password() {
    return this.registrationForm.get('password');
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('name', this.registrationForm.get('name')!.value);
    formData.append('username', this.registrationForm.get('username')!.value);
    formData.append('password', this.registrationForm.get('password')!.value);

    this.userService.createUser(formData).subscribe({
      next: (res) => {
        if (res.status === 'error') {
          this.error = {
            errorTitle: 'OOPS! REQUEST FOR DOCUMENT FAILED',
            errorDesc: res.message,
          };
        }
        this.submitted = true;
      },
      error: (error: ApiError) => {
        this.submitted = true;
        this.error = error;
        console.log(this.error, error);
      },
    });
  }

  gotoHome() {
    this.router.navigate(['/']);
  }
}
