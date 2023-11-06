import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrediagnosticoVirtualPage } from './prediagnostico-virtual.page';

describe('PrediagnosticoVirtualPage', () => {
  let component: PrediagnosticoVirtualPage;
  let fixture: ComponentFixture<PrediagnosticoVirtualPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PrediagnosticoVirtualPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
