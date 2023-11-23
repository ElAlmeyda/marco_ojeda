import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KidPlanetPage } from './kid-planet.page';

describe('KidPlanetPage', () => {
  let component: KidPlanetPage;
  let fixture: ComponentFixture<KidPlanetPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(KidPlanetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
