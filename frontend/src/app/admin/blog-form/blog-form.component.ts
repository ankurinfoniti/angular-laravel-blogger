import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { ApiError } from 'src/app/models/apierror';
import { BlogService } from '../../services/blog.service';

@Component({
  selector: 'app-blog-form',
  templateUrl: './blog-form.component.html',
  styleUrls: ['./blog-form.component.css'],
})
export class BlogFormComponent implements OnInit {
  pageTitle: string = 'Create Blog';
  error!: ApiError;
  uploadError: string = '';
  imagePath: string = '';
  submitted = false;

  blogForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private blogService: BlogService,
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
      this.blogService.getBlog(id).subscribe((res) => {
        this.blogForm.patchValue({
          title: res.title,
          description: res.description,
          is_featured: res.is_featured,
          is_active: res.is_active,
          id: res.id,
        });
        this.imagePath = res.image;
      });
    }

    this.blogForm = this.fb.group({
      id: [''],
      title: ['', Validators.required],
      description: ['', Validators.required],
      is_featured: ['0'],
      is_active: ['1'],
      image: [''],
    });
  }

  onSelectedFile(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target != null && target.files!.length > 0) {
      const file = target.files![0];
      this.blogForm.get('image')!.setValue(file);
    }
  }

  get title() {
    return this.blogForm.get('title');
  }
  get description() {
    return this.blogForm.get('description');
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('title', this.blogForm.get('title')!.value);
    formData.append('description', this.blogForm.get('description')!.value);
    formData.append('is_featured', this.blogForm.get('is_featured')!.value);
    formData.append('is_active', this.blogForm.get('is_active')!.value);
    formData.append('image', this.blogForm.get('image')!.value);

    const id = this.blogForm.get('id')?.value;

    if (id) {
      this.blogService.updateBlog(formData, +id).subscribe({
        next: (res) => {
          if (res.status === 'error') {
            if (res.uploadError) {
              this.uploadError = res.message;
            } else {
              this.error = res.message;
            }
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
      this.blogService.createBlog(formData).subscribe({
        next: (res) => {
          if (res.status === 'error') {
            if (res.uploadError) {
              this.uploadError = res.message;
            } else {
              this.error.errorTitle = 'OOPS! REQUEST FOR DOCUMENT FAILED';
              this.error.errorDesc = res.message;
            }
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
    this.router.navigate(['/admin/blogs']);
  }
}
