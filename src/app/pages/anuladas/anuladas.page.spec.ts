import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnuladasPage } from './anuladas.page';

describe('AnuladasPage', () => {
  let component: AnuladasPage;
  let fixture: ComponentFixture<AnuladasPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AnuladasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
