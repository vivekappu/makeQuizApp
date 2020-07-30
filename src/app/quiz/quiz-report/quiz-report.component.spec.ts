import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizReportComponent } from './quiz-report.component';

describe('QuizReportComponent', () => {
  let component: QuizReportComponent;
  let fixture: ComponentFixture<QuizReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuizReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
