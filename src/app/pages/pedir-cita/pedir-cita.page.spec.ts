import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PedirCitaPage } from './pedir-cita.page';

describe('PedirCitaPage', () => {
  let component: PedirCitaPage;
  let fixture: ComponentFixture<PedirCitaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PedirCitaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
