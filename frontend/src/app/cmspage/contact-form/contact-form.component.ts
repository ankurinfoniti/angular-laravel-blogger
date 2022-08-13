import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CmspageService } from '../cmspage.service';
import { Contact } from '../../models/contact';
import { ApiError } from '../../models/apierror';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css'],
})
export class ContactFormComponent implements OnInit {
  error!: ApiError;
  model: Contact = { id: 0, name: '', email: '', phone: '', message: '' };
  submitted = false;

  constructor(private router: Router, private cmspageService: CmspageService) {}

  ngOnInit(): void {}

  onSubmit() {
    this.submitted = true;
    return this.cmspageService.contactForm(this.model).subscribe({
      next: (data) => (this.model = data),
      error: (error: ApiError) => {
        this.error = error;
        console.log(this.error, error);
      },
    });
  }

  gotoHome() {
    this.router.navigate(['/']);
  }
}
