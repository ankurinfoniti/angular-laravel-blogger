import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';

import { BlogpostRoutingModule } from './blogpost-routing.module';
import { BlogpostFeaturedComponent } from './blogpost-featured/blogpost-featured.component';
import { BlogpostListComponent } from './blogpost-list/blogpost-list.component';
import { BlogpostDetailComponent } from './blogpost-detail/blogpost-detail.component';
import { BlogpostRecentComponent } from './blogpost-recent/blogpost-recent.component';
import { CategoriesComponent } from './categories/categories.component';
import { SharedModule } from '../shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BlogVoteComponent } from './blog-vote/blog-vote.component';

@NgModule({
  declarations: [
    BlogpostFeaturedComponent,
    BlogpostListComponent,
    BlogpostDetailComponent,
    BlogpostRecentComponent,
    CategoriesComponent,
    BlogVoteComponent,
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    ShareButtonsModule,
    ShareIconsModule,
    SharedModule,
    BlogpostRoutingModule,
  ],
  exports: [BlogpostFeaturedComponent],
})
export class BlogpostModule {}
