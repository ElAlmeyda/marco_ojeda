import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminNoticiaPage } from './admin-noticia.page';

describe('AdminNoticiaPage', () => {
  let component: AdminNoticiaPage;
  let fixture: ComponentFixture<AdminNoticiaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AdminNoticiaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
