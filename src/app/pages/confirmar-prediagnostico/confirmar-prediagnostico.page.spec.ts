import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmarPrediagnosticoPage } from './confirmar-prediagnostico.page';

describe('ConfirmarPrediagnosticoPage', () => {
  let component: ConfirmarPrediagnosticoPage;
  let fixture: ComponentFixture<ConfirmarPrediagnosticoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ConfirmarPrediagnosticoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
