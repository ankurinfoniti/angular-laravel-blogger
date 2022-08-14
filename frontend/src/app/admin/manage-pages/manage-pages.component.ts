import { Component, OnInit } from '@angular/core';

import { PageService } from '../../services/page.service';
import { Page } from 'src/app/models/page';
import { ApiError } from 'src/app/models/apierror';

@Component({
  selector: 'app-manage-pages',
  templateUrl: './manage-pages.component.html',
  styleUrls: ['./manage-pages.component.css'],
})
export class ManagePagesComponent implements OnInit {
  title = 'Manage Pages';
  pages!: Array<Page>;
  error!: ApiError;
  success = '';

  constructor(private pageService: PageService) {}

  ngOnInit(): void {
    this.pageService.getPages().subscribe({
      next: (data) => {
        this.pages = data;
      },
      error: (error: ApiError) => {
        this.error = error;
        console.log(this.error, error);
      },
    });
  }

  onDelete(id: number) {
    if (confirm('Are you sure want to delete?')) {
      this.pageService.deletePage(id).subscribe({
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
