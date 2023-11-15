import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LaClinicaPage } from './la-clinica.page';

describe('LaClinicaPage', () => {
  let component: LaClinicaPage;
  let fixture: ComponentFixture<LaClinicaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LaClinicaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
