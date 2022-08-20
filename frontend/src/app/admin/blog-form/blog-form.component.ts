import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  Validators,
  FormGroup,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { Editor, Toolbar } from 'ngx-editor';

import { ApiError } from 'src/app/models/apierror';
import { Category } from 'src/app/models/category';
import { BlogService } from '../../services/blog.service';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-blog-form',
  templateUrl: './blog-form.component.html',
  styleUrls: ['./blog-form.component.css'],
})
export class BlogFormComponent implements OnInit, OnDestroy {
  pageTitle: string = 'Create Blog';
  error!: ApiError;
  uploadError: string = '';
  imagePath: string = '';
  submitted = false;
  categories!: Array<Category>;

  blogForm!: FormGroup;

  editor!: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  constructor(
    private fb: FormBuilder,
    private blogService: BlogService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.editor = new Editor();
    let id = 0;
    this.route.params.subscribe((params) => {
      id = +params['id'];
    });

    // fetch all categories
    this.categoryService.getCategories().subscribe((res) => {
      this.categories = res;
    });

    if (id) {
      this.pageTitle = 'Edit Blog';
      this.blogService.getBlog(id).subscribe((res) => {
        this.blogForm.patchValue({
          title: res.title,
          category: res.category_id,
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
      category: [''],
      description: ['', [Validators.required, this.noWhitespaceValidator]],
      is_featured: ['0'],
      is_active: ['1'],
      image: [''],
    });
  }

  private noWhitespaceValidator(control: FormControl) {
    let value = control.value;
    // test for empty field
    const isWhitespace =
      value.replace(/<(.|\n)*?>/g, '').trim().length === 0 &&
      !value.includes('<img');
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
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
    formData.append('category', this.blogForm.get('category')!.value);
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

  ngOnDestroy(): void {
    this.editor.destroy();
  }
}
