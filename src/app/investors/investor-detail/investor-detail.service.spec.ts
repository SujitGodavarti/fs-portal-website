import { TestBed } from '@angular/core/testing';

import { InvestorDetailService } from './investor-detail.service';

describe('InvestorDetailService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InvestorDetailService = TestBed.get(InvestorDetailService);
    expect(service).toBeTruthy();
  });
});
