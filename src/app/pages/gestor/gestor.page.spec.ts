import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GestorPage } from './gestor.page';

describe('GestorPage', () => {
  let component: GestorPage;
  let fixture: ComponentFixture<GestorPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(GestorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
