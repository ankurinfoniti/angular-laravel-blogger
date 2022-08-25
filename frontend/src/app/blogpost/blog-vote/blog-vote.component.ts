import { Component, Input, OnInit } from '@angular/core';

import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { faThumbsDown } from '@fortawesome/free-solid-svg-icons';

import { Vote } from 'src/app/models/vote';
import { VoteService } from 'src/app/services/vote.service';

@Component({
  selector: 'app-blog-vote',
  templateUrl: './blog-vote.component.html',
  styleUrls: ['./blog-vote.component.css'],
})
export class BlogVoteComponent implements OnInit {
  @Input() blogId: number = 0;
  @Input() set vote(vote: Vote | null) {
    if (vote) {
      this.totalLikes = vote.like;
      this.totaldislikes = vote.dislike;
    }
  }

  faThumbsUp = faThumbsUp;
  faThumbsDown = faThumbsDown;
  totalLikes: number = 0;
  totaldislikes: number = 0;

  constructor(private voteService: VoteService) {}

  ngOnInit(): void {}

  likes() {
    this.voteService.voted(this.blogId, 'like').subscribe((res) => {
      if (res) {
        this.totalLikes = res.like;
        this.totaldislikes = res.dislike;
      }
    });
  }

  dislike() {
    this.voteService.voted(this.blogId, 'dislike').subscribe((res) => {
      if (res) {
        this.totalLikes = res.like;
        this.totaldislikes = res.dislike;
      }
    });
  }
}
