import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TatuadorPage } from './tatuador.page';

describe('TatuadorPage', () => {
  let component: TatuadorPage;
  let fixture: ComponentFixture<TatuadorPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TatuadorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
