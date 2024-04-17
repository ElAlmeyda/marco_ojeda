import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UrgenciaPage } from './urgencia.page';

describe('UrgenciaPage', () => {
  let component: UrgenciaPage;
  let fixture: ComponentFixture<UrgenciaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(UrgenciaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
