import { Component, Input, OnInit } from '@angular/core';

import { ActiveComment } from 'src/app/models/activecomment';
import { ApiError } from 'src/app/models/apierror';
import { Blogpost } from 'src/app/models/blogpost';
import { Comment } from 'src/app/models/comment';
import { User } from 'src/app/models/user';
import { CommentsService } from 'src/app/services/comments.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css'],
})
export class CommentsComponent implements OnInit {
  @Input() loginUser!: User;
  @Input() blog!: Blogpost;

  comments: Comment[] = [];
  activeComment: ActiveComment | null = null;

  constructor(private commentsService: CommentsService) {}

  ngOnInit(): void {
    this.commentsService.getComments().subscribe((comments) => {
      this.comments = comments;
    });
  }

  getRootComments(): Comment[] {
    return this.comments.filter((comment) => comment.parentId === null);
  }

  updateComment({
    text,
    commentId,
  }: {
    text: string;
    commentId: string;
  }): void {
    this.commentsService
      .updateComment(commentId, text)
      .subscribe((data: any) => {
        if (data['status'] === 'success') {
          this.comments = this.comments.map((comment) => {
            if (comment.id === commentId) {
              return data['data'];
            }
            return comment;
          });
        }
        this.activeComment = null;
      });
  }

  deleteComment(commentId: string): void {
    this.commentsService.deleteComment(commentId).subscribe((data) => {
      if (data['status'] === 'success') {
        this.comments = this.comments.filter(
          (comment) => comment.id !== commentId
        );
      }
    });
  }

  setActiveComment(activeComment: ActiveComment | null): void {
    this.activeComment = activeComment;
  }

  addComment({
    text,
    parentId,
  }: {
    text: string;
    parentId: string | null;
  }): void {
    const blog = {
      blogId: this.blog.id,
      body: text,
      username: this.loginUser.name,
      userId: this.loginUser.id,
      parentId: parentId,
    };

    this.commentsService.createComment(blog).subscribe((createdComment) => {
      this.comments = [...this.comments, createdComment];
      this.activeComment = null;
    });
  }

  getReplies(commentId: string): Comment[] {
    return this.comments
      .filter((comment) => comment.parentId === commentId)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
  }
}
