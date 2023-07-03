import { TestBed } from '@angular/core/testing';

import { PytCustTblService } from './pyt-cust-tbl.service';

describe('PytCustTblService', () => {
  let service: PytCustTblService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PytCustTblService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
