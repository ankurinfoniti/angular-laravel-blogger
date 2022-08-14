import { Component, OnInit } from '@angular/core';

import { BlogService } from '../../services/blog.service';
import { Blog } from '../../models/blog';
import { ApiError } from 'src/app/models/apierror';

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

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.blogService.getBlogs().subscribe({
      next: (data) => (this.blogs = data),
      error: (error: ApiError) => {
        this.error = error;
        console.log(this.error, error);
      },
    });
  }

  onDelete(id: number) {
    if (confirm('Are you sure want to delete?')) {
      this.blogService.deleteBlog(+id).subscribe({
        next: (res) => {
          if (res.status === 'error') {
            this.error.errorTitle = 'OOPS! REQUEST FOR DOCUMENT FAILED';
            this.error.errorDesc = res.message;
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