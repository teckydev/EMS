import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskProgressDialogComponent } from './task-progress-dialog.component';

describe('TaskProgressDialogComponent', () => {
  let component: TaskProgressDialogComponent;
  let fixture: ComponentFixture<TaskProgressDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskProgressDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskProgressDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
