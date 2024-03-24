import { TestBed } from '@angular/core/testing';

import { EquipoServiceService } from './equipo-service.service';

describe('EquipoServiceService', () => {
  let service: EquipoServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EquipoServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
