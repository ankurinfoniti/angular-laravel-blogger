import { Component, OnInit } from '@angular/core';

import { BlogpostService } from '../blogpost.service';
import { GeneralService } from '../../Services/general.service';
import { Blogpost } from '../../Models/blogpost';
import { ApiError } from '../../Models/apierror';

@Component({
  selector: 'app-blogpost-featured',
  templateUrl: './blogpost-featured.component.html',
  styleUrls: ['./blogpost-featured.component.css'],
})
export class BlogpostFeaturedComponent implements OnInit {
  blogs!: Array<Blogpost>;
  error!: ApiError;

  constructor(
    private blogpostService: BlogpostService,
    public generalService: GeneralService
  ) {}

  ngOnInit(): void {
    this.blogpostService.getFeaturedBlogs().subscribe(
      (data) => (this.blogs = data),
      (error) => (this.error = error)
    );
  }
}
