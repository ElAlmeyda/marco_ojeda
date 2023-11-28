import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminEquipoPage } from './admin-equipo.page';

describe('AdminEquipoPage', () => {
  let component: AdminEquipoPage;
  let fixture: ComponentFixture<AdminEquipoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AdminEquipoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
