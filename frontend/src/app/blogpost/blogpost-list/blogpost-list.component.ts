import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { BlogpostService } from '../blogpost.service';
import { GeneralService } from '../../services/general.service';
import { Blogpost } from '../../models/blogpost';
import { ApiError } from '../../models/apierror';

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
    private generalService: GeneralService
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle(this.title);

    this.blogpostService.getBlogs().subscribe({
      next: (data) => (this.blogs = data),
      error: (error) => (this.error = error),
    });
  }

  shortDescription(value: string) {
    return this.generalService.getShortDescription(value);
  }
}
