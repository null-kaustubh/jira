import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectSummary } from './project-summary';

describe('ProjectSummary', () => {
  let component: ProjectSummary;
  let fixture: ComponentFixture<ProjectSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectSummary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectSummary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
