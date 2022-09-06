import { Component, OnInit } from '@angular/core';

import { AdminService } from '../../services/admin.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Blog } from '../../models/blog';
import { ApiError } from 'src/app/models/apierror';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {
  total = {
    blogTotal: 0,
    userTotal: 0,
    likeTotal: 0,
    inactiveTotal: 0,
  };
  recentBlogs!: Array<{ title: string; image: string; isActive: string }>;
  recentComments!: Array<{ body: string; username: string }>;

  error!: ApiError;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.getTotalData().subscribe({
      next: (data) => {
        if (data) {
          this.total = data.total;
          this.recentBlogs = data.recentBlogs;
          this.recentComments = data.recentComments;
        }
      },
      error: (error: ApiError) => {
        this.error = error;
        console.log(this.error, error);
      },
    });
  }
}
