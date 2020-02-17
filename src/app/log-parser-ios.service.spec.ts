import { TestBed } from '@angular/core/testing';

import { LogParserIosService } from './log-parser-ios.service';

describe('LogParserIosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LogParserIosService = TestBed.get(LogParserIosService);
    expect(service).toBeTruthy();
  });
});
