import { Component, OnInit } from '@angular/core';

import { BlogpostService } from '../blogpost.service';
import { Blogpost } from '../../models/blogpost';
import { ApiError } from 'src/app/models/apierror';

@Component({
  selector: 'app-blogpost-recent',
  templateUrl: './blogpost-recent.component.html',
  styleUrls: ['./blogpost-recent.component.css'],
})
export class BlogpostRecentComponent implements OnInit {
  blogs!: Array<Blogpost>;
  error!: ApiError;

  constructor(private blogpostService: BlogpostService) {}

  ngOnInit(): void {
    this.blogpostService.getRecentBlogs().subscribe({
      next: (data) => (this.blogs = data),
      error: (error) => (this.error = error),
    });
  }
}
