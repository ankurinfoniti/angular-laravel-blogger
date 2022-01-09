import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactFormComponent } from './contact-form/contact-form.component';
import { PageComponent } from './page/page.component';

const routes: Routes = [
  {
    path: 'page/:slug',
    component: PageComponent,
  },
  {
    path: 'contact',
    component: ContactFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CmspageRoutingModule {}
