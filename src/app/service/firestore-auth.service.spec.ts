import { TestBed } from '@angular/core/testing';

import { FirestoreAuthService } from './firestore-auth.service';

describe('FirestoreAuthService', () => {
  let service: FirestoreAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirestoreAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
