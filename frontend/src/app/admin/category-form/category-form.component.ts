import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { CategoryService } from '../../services/category.service';
import { Category } from 'src/app/models/category';
import { ApiError } from 'src/app/models/apierror';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css'],
})
export class CategoryFormComponent implements OnInit {
  pageTitle: string = 'Create Category';
  error!: ApiError;
  submitted = false;

  categoryForm!: FormGroup;

  constructor(
    private categoryService: CategoryService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    let id = 0;
    this.route.params.subscribe((params) => {
      id = +params['id'];
    });

    if (id) {
      this.pageTitle = 'Edit Blog';
      this.categoryService.getCategory(id).subscribe((res) => {
        this.categoryForm.patchValue({
          name: res['category_name'],
          id: res['id'],
        });
      });
    }

    this.categoryForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
    });
  }

  get name() {
    return this.categoryForm.get('name');
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('name', this.categoryForm.get('name')!.value);

    const id = this.categoryForm.get('id')?.value;

    if (id) {
      this.categoryService.updateCategory(formData, +id).subscribe({
        next: (res) => {
          if (res.status === 'error') {
            this.error.errorTitle = 'OOPS! REQUEST FOR DOCUMENT FAILED';
            this.error.errorDesc = res.message;
          }
          this.submitted = true;
        },
        error: (error: ApiError) => {
          this.submitted = true;
          this.error = error;
          console.log(this.error, error);
        },
      });
    } else {
      this.categoryService.createCategory(formData).subscribe({
        next: (res) => {
          if (res.status === 'error') {
            this.error.errorTitle = 'OOPS! REQUEST FOR DOCUMENT FAILED';
            this.error.errorDesc = res.message;
          }
          this.submitted = true;
        },
        error: (error: ApiError) => {
          this.submitted = true;
          this.error = error;
          console.log(this.error, error);
        },
      });
    }
  }

  gotoHome() {
    this.router.navigate(['/admin/categories']);
  }
}
