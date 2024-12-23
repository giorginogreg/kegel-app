import { TestBed } from '@angular/core/testing';

import { CircleAnimatingService } from './circle-animating.service';

describe('CircleAnimatingService', () => {
  let service: CircleAnimatingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CircleAnimatingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
