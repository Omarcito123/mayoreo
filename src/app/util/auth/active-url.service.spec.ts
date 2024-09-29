import { TestBed } from '@angular/core/testing';

import { ActiveUrlService } from './active-url.service';

describe('ActiveUrlService', () => {
  let service: ActiveUrlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActiveUrlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
