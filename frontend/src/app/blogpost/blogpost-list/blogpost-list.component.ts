import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { switchMap } from 'rxjs';

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
  category = '';
  error!: ApiError;
  page: number = 1;
  perPage: number = 10;
  total!: number;

  constructor(
    private route: ActivatedRoute,
    private titleService: Title,
    private blogpostService: BlogpostService,
    private generalService: GeneralService
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle(this.title);
    this.route.params.subscribe((data: any) => {
      this.loadBlog(data.slug);
    });
  }

  loadBlog(category = '') {
    this.blogpostService.getBlogs(this.page, this.perPage, category).subscribe({
      next: (data: any) => {
        this.total = data.total;

        if (data['blog'] && this.page == 1) {
          this.blogs = data['blog'];
        }

        if (data['blog'] && this.page > 1) {
          this.blogs.push(...data['blog']);
        }

        this.page++;
      },
      error: (error) => (this.error = error),
    });
  }

  shortDescription(value: string) {
    return this.generalService.getShortDescription(value);
  }
}
