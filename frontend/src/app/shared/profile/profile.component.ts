import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  Validators,
  FormGroup,
} from '@angular/forms';

import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/auth/auth.service';
import { UserService } from '../../services/user.service';
import { ApiError } from 'src/app/models/apierror';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  pageTitle = 'Profile';
  submitted = '';
  loginUser!: User;
  error!: ApiError;

  userForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loginUser = this.authService.getLoggedInUser();

    this.userForm = this.fb.group({
      name: [this.loginUser.name, Validators.required],
      password: [''],
    });
  }

  get name() {
    return this.userForm.get('name');
  }

  get password() {
    return this.userForm.get('password');
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('name', this.userForm.get('name')!.value);
    formData.append('password', this.userForm.get('password')!.value);

    let id = this.loginUser.id;

    this.userService.updateUser(formData, +id).subscribe({
      next: (res) => {
        if (res.status === 'error') {
          this.error = {
            errorTitle: 'OOPS! REQUEST FOR DOCUMENT FAILED',
            errorDesc: res.message,
          };
        } else {
          this.submitted = res.message;
          this.authService.updateLoggedInUserName(
            this.userForm.get('name')!.value
          );
          this.userForm.patchValue({ password: '' });
        }
      },
      error: (error: ApiError) => {
        this.error = error;
        console.log(this.error, error);
      },
    });
  }
}
