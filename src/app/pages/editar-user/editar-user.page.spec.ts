import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarUserPage } from './editar-user.page';

describe('EditarUserPage', () => {
  let component: EditarUserPage;
  let fixture: ComponentFixture<EditarUserPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EditarUserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
