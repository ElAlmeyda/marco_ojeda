import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminProductoPage } from './admin-producto.page';

describe('AdminProductoPage', () => {
  let component: AdminProductoPage;
  let fixture: ComponentFixture<AdminProductoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AdminProductoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
