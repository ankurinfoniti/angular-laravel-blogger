import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { switchMap } from 'rxjs/operators';

import { CmspageService } from '../cmspage.service';
import { Page } from '../../Models/page';
import { ApiError } from '../../Models/apierror';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css'],
})
export class PageComponent implements OnInit {
  page!: Page;
  error!: ApiError;

  constructor(
    private cmspageService: CmspageService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          let slug = params.get('slug');
          return this.cmspageService.getPage(slug ? slug : '');
        })
      )
      .subscribe({
        next: (data) => (this.page = data),
        error: (error) => (this.error = error),
      });
  }
}
