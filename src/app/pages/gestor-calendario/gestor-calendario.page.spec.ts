import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GestorCalendarioPage } from './gestor-calendario.page';

describe('GestorCalendarioPage', () => {
  let component: GestorCalendarioPage;
  let fixture: ComponentFixture<GestorCalendarioPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(GestorCalendarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
