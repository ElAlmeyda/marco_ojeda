import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregarNoticiaPage } from './agregar-noticia.page';

describe('AgregarNoticiaPage', () => {
  let component: AgregarNoticiaPage;
  let fixture: ComponentFixture<AgregarNoticiaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AgregarNoticiaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
