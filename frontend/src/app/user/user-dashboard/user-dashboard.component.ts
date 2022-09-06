import { Component, OnInit } from '@angular/core';

import { AdminService } from '../../services/admin.service';
import { ApiError } from 'src/app/models/apierror';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css'],
})
export class UserDashboardComponent implements OnInit {
  total = {
    blogTotal: 0,
    likeTotal: 0,
    dislikeTotal: 0,
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
