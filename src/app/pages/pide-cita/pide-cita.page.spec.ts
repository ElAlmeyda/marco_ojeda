import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PideCitaPage } from './pide-cita.page';

describe('PideCitaPage', () => {
  let component: PideCitaPage;
  let fixture: ComponentFixture<PideCitaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PideCitaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
