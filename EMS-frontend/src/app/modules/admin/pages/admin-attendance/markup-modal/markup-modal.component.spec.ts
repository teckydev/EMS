import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkupModalComponent } from './markup-modal.component';

describe('MarkupModalComponent', () => {
  let component: MarkupModalComponent;
  let fixture: ComponentFixture<MarkupModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarkupModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarkupModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
