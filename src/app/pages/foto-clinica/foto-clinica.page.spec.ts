import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FotoClinicaPage } from './foto-clinica.page';

describe('FotoClinicaPage', () => {
  let component: FotoClinicaPage;
  let fixture: ComponentFixture<FotoClinicaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(FotoClinicaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
