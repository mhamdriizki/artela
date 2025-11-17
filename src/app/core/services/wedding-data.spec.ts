import { TestBed } from '@angular/core/testing';

import { WeddingData } from './wedding-data';

describe('WeddingData', () => {
  let service: WeddingData;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeddingData);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
