import { Component, OnInit } from '@angular/core';

import { CategoryService } from '../../services/category.service';
import { Category } from 'src/app/models/category';
import { ApiError } from 'src/app/models/apierror';

@Component({
  selector: 'app-manage-categories',
  templateUrl: './manage-categories.component.html',
  styleUrls: ['./manage-categories.component.css'],
})
export class ManageCategoriesComponent implements OnInit {
  title = 'Manage Categories';
  categories!: Array<Category>;
  error!: ApiError;
  success = '';

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (error: ApiError) => {
        this.error = error;
        console.log(this.error, error);
      },
    });
  }

  onDelete(id: number) {
    if (confirm('Are you sure want to delete?')) {
      this.categoryService.deleteCategory(id).subscribe({
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
