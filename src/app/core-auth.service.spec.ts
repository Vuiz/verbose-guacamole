import { TestBed, inject } from '@angular/core/testing';

import { CoreAuthService } from './core-auth.service';

describe('CoreAuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CoreAuthService]
    });
  });

  it('should be created', inject([CoreAuthService], (service: CoreAuthService) => {
    expect(service).toBeTruthy();
  }));
});
