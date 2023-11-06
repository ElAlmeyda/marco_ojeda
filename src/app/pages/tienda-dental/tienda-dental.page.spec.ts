import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TiendaDentalPage } from './tienda-dental.page';

describe('TiendaDentalPage', () => {
  let component: TiendaDentalPage;
  let fixture: ComponentFixture<TiendaDentalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TiendaDentalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
