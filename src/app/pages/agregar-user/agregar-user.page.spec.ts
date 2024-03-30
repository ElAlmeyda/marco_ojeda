import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregarUserPage } from './agregar-user.page';

describe('AgregarUserPage', () => {
  let component: AgregarUserPage;
  let fixture: ComponentFixture<AgregarUserPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AgregarUserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
