import { Component, OnInit } from '@angular/core';

import { BlogpostService } from '../blogpost.service';
import { Category } from '../../Models/category';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent implements OnInit {
  categories!: Array<Category>;

  constructor(private blogpostService: BlogpostService) {}

  ngOnInit(): void {
    this.blogpostService.getCategories().subscribe({
      next: (data) => (this.categories = data),
    });
  }
}
