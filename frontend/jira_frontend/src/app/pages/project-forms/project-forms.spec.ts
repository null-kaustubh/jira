import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectForms } from './project-forms';

describe('ProjectForms', () => {
  let component: ProjectForms;
  let fixture: ComponentFixture<ProjectForms>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectForms]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectForms);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
