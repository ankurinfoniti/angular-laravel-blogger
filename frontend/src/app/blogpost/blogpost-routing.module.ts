import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogpostDetailComponent } from './blogpost-detail/blogpost-detail.component';
import { BlogpostListComponent } from './blogpost-list/blogpost-list.component';

const routes: Routes = [
  {
    path: 'blogs',
    component: BlogpostListComponent,
  },
  {
    path: 'blog/:slug',
    component: BlogpostDetailComponent,
  },
  {
    path: 'category/:slug',
    component: BlogpostListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BlogpostRoutingModule {}
