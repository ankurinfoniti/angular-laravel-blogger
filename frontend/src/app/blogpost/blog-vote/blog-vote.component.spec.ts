import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogVoteComponent } from './blog-vote.component';

describe('BlogVoteComponent', () => {
  let component: BlogVoteComponent;
  let fixture: ComponentFixture<BlogVoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogVoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogVoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
