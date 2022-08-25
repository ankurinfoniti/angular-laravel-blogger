import { Component, OnInit } from '@angular/core';

import { BlogService } from '../../services/blog.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Blog } from '../../models/blog';
import { ApiError } from 'src/app/models/apierror';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-manage-blogs',
  templateUrl: './manage-blogs.component.html',
  styleUrls: ['./manage-blogs.component.css'],
})
export class ManageBlogsComponent implements OnInit {
  title = 'Manage Blogs';
  blogs!: Array<Blog>;
  error!: ApiError;
  success = '';
  page: number = 1;
  total: number = 0;
  perPage: number = 10;
  count: number = 0;
  loginUser!: User;

  constructor(
    private blogService: BlogService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loginUser = this.authService.getLoggedInUser();
    this.getBlogs();
  }

  getBlogs() {
    this.blogService.getBlogs(this.page, this.perPage).subscribe({
      next: (data: any) => {
        this.blogs = data.posts;
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
    this.getBlogs();
  }

  getStatus(blog: Blog) {
    if (blog.is_active === 1) {
      return 'Active';
    }

    if (blog.is_active === 0) {
      return 'Inactive';
    }

    if (blog.is_active === 2) {
      return 'Rejected';
    }

    return '';
  }

  onDelete(id: number) {
    if (confirm('Are you sure want to delete?')) {
      this.blogService.deleteBlog(+id).subscribe({
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
