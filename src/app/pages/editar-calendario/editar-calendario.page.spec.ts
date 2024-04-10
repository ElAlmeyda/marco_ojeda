import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarCalendarioPage } from './editar-calendario.page';

describe('EditarCalendarioPage', () => {
  let component: EditarCalendarioPage;
  let fixture: ComponentFixture<EditarCalendarioPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EditarCalendarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
