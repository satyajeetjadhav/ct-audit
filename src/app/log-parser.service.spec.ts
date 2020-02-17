import { TestBed } from '@angular/core/testing';

import { LogParserService } from './log-parser.service';

describe('LogParserService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LogParserService = TestBed.get(LogParserService);
    expect(service).toBeTruthy();
  });
});
