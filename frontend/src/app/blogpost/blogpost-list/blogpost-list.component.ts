import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { BlogpostService } from '../blogpost.service';
import { GeneralService } from '../../Services/general.service';
import { Blogpost } from '../../Models/blogpost';
import { ApiError } from '../../Models/apierror';

@Component({
  selector: 'app-blogpost-list',
  templateUrl: './blogpost-list.component.html',
  styleUrls: ['./blogpost-list.component.css'],
})
export class BlogpostListComponent implements OnInit {
  title = 'Blogs';
  blogs!: Array<Blogpost>;
  error!: ApiError;

  constructor(
    private titleService: Title,
    private blogpostService: BlogpostService,
    public generalService: GeneralService
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle(this.title);

    this.blogpostService.getBlogs().subscribe({
      next: (data) => (this.blogs = data),
      error: (error) => (this.error = error),
    });
  }

  shortDescription(value: string) {
    return value.slice(0, 50);
  }
}
