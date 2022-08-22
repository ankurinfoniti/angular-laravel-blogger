import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CmspageRoutingModule } from './cmspage-routing.module';
import { PageComponent } from './page/page.component';
import { ContactFormComponent } from './contact-form/contact-form.component';
import { RegisterComponent } from './register/register.component';
// import { UniqueUsernameDirective } from './directive/unique-username.directive';

@NgModule({
  declarations: [
    PageComponent,
    ContactFormComponent,
    RegisterComponent,
    // UniqueUsernameDirective,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CmspageRoutingModule,
  ],
})
export class CmspageModule {}
