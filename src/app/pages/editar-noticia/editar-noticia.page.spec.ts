import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarNoticiaPage } from './editar-noticia.page';

describe('EditarNoticiaPage', () => {
  let component: EditarNoticiaPage;
  let fixture: ComponentFixture<EditarNoticiaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EditarNoticiaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
