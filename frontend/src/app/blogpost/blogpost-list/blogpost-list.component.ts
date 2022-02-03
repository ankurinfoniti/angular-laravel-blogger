import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { BlogpostService } from '../blogpost.service';
import { GeneralService } from '../../Services/general.service';
import { Blogpost } from '../../Models/blogpost';

@Component({
  selector: 'app-blogpost-list',
  templateUrl: './blogpost-list.component.html',
  styleUrls: ['./blogpost-list.component.css'],
})
export class BlogpostListComponent implements OnInit {
  title = 'Blogs';
  blogs!: Array<Blogpost>;
  error: {} = {};

  constructor(
    private titleService: Title,
    private blogpostService: BlogpostService,
    public generalService: GeneralService
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle(this.title);

    this.blogpostService.getBlogs().subscribe(
      (data) => (this.blogs = data),
      (error) => (this.error = error)
    );
  }

  shortDescription(value: string) {
    return value.slice(0, 50);
  }
}
