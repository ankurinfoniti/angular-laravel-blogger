import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Route, ActivatedRoute, ParamMap, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { BlogpostService } from '../blogpost.service';
import { Blogpost } from '../../Models/blogpost';
import { Category } from '../../Models/category';
import { ApiError } from '../../Models/apierror';

@Component({
  selector: 'app-blogpost-detail',
  templateUrl: './blogpost-detail.component.html',
  styleUrls: ['./blogpost-detail.component.css'],
})
export class BlogpostDetailComponent implements OnInit {
  blog$!: Observable<Blogpost>;

  constructor(
    private blogpostService: BlogpostService,
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.blog$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        let id = params.get('id');
        return this.blogpostService.getBlog(id ? +id : 0);
      })
    );

    this.titleService.setTitle('Blog Detail');
  }
}
