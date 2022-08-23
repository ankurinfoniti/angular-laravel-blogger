import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user/user.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { ManageBlogsComponent } from './manage-blogs/manage-blogs.component';
import { BlogFormComponent } from './blog-form/blog-form.component';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  declarations: [
    UserComponent,
    UserDashboardComponent,
    ManageBlogsComponent,
    BlogFormComponent,
    ProfileComponent,
  ],
  imports: [CommonModule, UserRoutingModule],
})
export class UserModule {}
