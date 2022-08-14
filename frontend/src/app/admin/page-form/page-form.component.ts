import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Editor, Toolbar } from 'ngx-editor';

import { PageService } from '../../services/page.service';
import { ApiError } from 'src/app/models/apierror';

@Component({
  selector: 'app-page-form',
  templateUrl: './page-form.component.html',
  styleUrls: ['./page-form.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class PageFormComponent implements OnInit {
  pageTitle: string = 'Create Page';
  error!: ApiError;
  submitted = false;

  pageForm!: FormGroup;

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
    private pageService: PageService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.editor = new Editor();
    let id = 0;
    this.route.params.subscribe((params) => {
      id = +params['id'];
    });

    if (id) {
      this.pageTitle = 'Edit Page';
      this.pageService.getPage(id).subscribe({
        next: (res) => {
          this.pageForm.patchValue({
            title: res.title,
            description: res.description,
            is_active: res.is_active,
            id: res.id,
          });
        },
      });
    }

    this.pageForm = this.fb.group({
      id: [''],
      title: ['', Validators.required],
      description: ['', [Validators.required, this.noWhitespaceValidator]],
      is_active: ['1'],
    });
  }

  get title() {
    return this.pageForm.get('title');
  }

  get description() {
    return this.pageForm.get('description');
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

  onSubmit() {
    const formData = new FormData();
    formData.append('title', this.pageForm.get('title')!.value);
    formData.append('description', this.pageForm.get('description')!.value);
    formData.append('is_active', this.pageForm.get('is_active')!.value);

    const id = this.pageForm.get('id')?.value;

    if (id) {
      this.pageService.updatePage(formData, +id).subscribe({
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
      this.pageService.createPage(formData).subscribe({
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
    this.router.navigate(['/admin/pages']);
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }
}
