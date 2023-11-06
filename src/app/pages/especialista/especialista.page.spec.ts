import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EspecialistaPage } from './especialista.page';

describe('EspecialistaPage', () => {
  let component: EspecialistaPage;
  let fixture: ComponentFixture<EspecialistaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EspecialistaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
