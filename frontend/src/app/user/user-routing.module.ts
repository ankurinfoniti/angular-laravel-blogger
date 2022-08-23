import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserGuard } from './user.guard';

import { UserComponent } from './user/user.component';
import { ManageBlogsComponent } from './manage-blogs/manage-blogs.component';
import { BlogFormComponent } from './blog-form/blog-form.component';
import { ProfileComponent } from './profile/profile.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';

const routes: Routes = [
  {
    path: 'user',
    component: UserComponent,
    canActivate: [UserGuard],
    children: [
      {
        path: '',
        children: [
          { path: 'blogs', component: ManageBlogsComponent },
          { path: 'blog-create', component: BlogFormComponent },
          { path: 'blog/edit/:id', component: BlogFormComponent },
          { path: 'profile', component: ProfileComponent },
          { path: '', component: UserDashboardComponent },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
