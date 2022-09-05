import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommentsComponent } from './comments/comments.component';
import { CommentComponent } from './comment/comment.component';
import { CommentFormComponent } from './comment-form/comment-form.component';
import { CommentsService } from '../services/comments.service';

@NgModule({
  declarations: [CommentsComponent, CommentComponent, CommentFormComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [CommentsComponent],
  providers: [CommentsService],
})
export class CommentsModule {}
