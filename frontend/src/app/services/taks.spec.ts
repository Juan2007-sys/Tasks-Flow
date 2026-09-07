import { TestBed } from '@angular/core/testing';

import { Taks } from './taks';

describe('Taks', () => {
  let service: Taks;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Taks);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
