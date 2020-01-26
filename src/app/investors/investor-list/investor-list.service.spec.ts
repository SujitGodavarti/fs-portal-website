import { TestBed } from '@angular/core/testing';

import { InvestorListService } from './investor-list.service';

describe('InvestorListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InvestorListService = TestBed.get(InvestorListService);
    expect(service).toBeTruthy();
  });
});
