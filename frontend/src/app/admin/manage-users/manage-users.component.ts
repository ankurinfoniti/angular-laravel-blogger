import { Component, OnInit } from '@angular/core';

import { UserService } from '../../services/user.service';
import { User } from 'src/app/models/user';
import { ApiError } from 'src/app/models/apierror';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css'],
})
export class ManageUsersComponent implements OnInit {
  title = 'Manage Users';
  users!: Array<User>;
  error!: ApiError;
  success = '';
  page: number = 1;
  total: number = 0;
  perPage: number = 1;
  count: number = 0;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.userService.getUsers(this.page, this.perPage).subscribe({
      next: (data: any) => {
        this.users = data.users;
        this.total = data.total;
        this.count = (this.page - 1) * this.perPage;
      },
      error: (error: ApiError) => {
        this.error = error;
        console.log(this.error, error);
      },
    });
  }

  pageChangeEvent(event: number) {
    this.page = event;
    this.getUsers();
  }

  onAction(id: number, status: number) {
    this.userService.activateUser({ id, status }).subscribe({
      next: (res) => {
        if (res.status === 'error') {
          this.error = {
            errorTitle: 'OOPS! REQUEST FOR DOCUMENT FAILED',
            errorDesc: res.message,
          };
        } else {
          this.success = res.message;
        }
        this.ngOnInit();
      },
      error: (error: ApiError) => {
        this.error = error;
        console.log(this.error, error);
      },
    });
  }

  onDelete(id: number) {
    if (confirm('Are you sure want to delete?')) {
      this.userService.deleteUser(id).subscribe({
        next: (res) => {
          if (res.status === 'error') {
            this.error = {
              errorTitle: 'OOPS! REQUEST FOR DOCUMENT FAILED',
              errorDesc: res.message,
            };
          } else {
            this.success = res.message;
          }
          this.ngOnInit();
        },
        error: (error: ApiError) => {
          this.error = error;
          console.log(this.error, error);
        },
      });
    }
  }
}
