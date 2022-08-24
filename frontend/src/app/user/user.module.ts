import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user/user.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  declarations: [UserComponent, UserDashboardComponent, ProfileComponent],
  imports: [CommonModule, UserRoutingModule],
})
export class UserModule {}
