import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { switchMap } from 'rxjs/operators';

import { BlogpostService } from '../blogpost.service';
import { Blogpost } from '../../models/blogpost';
import { ApiError } from '../../models/apierror';

@Component({
  selector: 'app-blogpost-detail',
  templateUrl: './blogpost-detail.component.html',
  styleUrls: ['./blogpost-detail.component.css'],
})
export class BlogpostDetailComponent implements OnInit {
  blog!: Blogpost;
  notFound = false;
  error!: ApiError;

  constructor(
    private blogpostService: BlogpostService,
    private route: ActivatedRoute,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          let slug = params.get('slug');
          return this.blogpostService.getBlog(slug ? slug : '');
        })
      )
      .subscribe({
        next: (data) => {
          this.blog = data;
          if (!this.blog) {
            this.notFound = true;
          }
        },
        error: (error) => (this.error = error),
      });

    this.titleService.setTitle('Blog Detail');
  }
}
