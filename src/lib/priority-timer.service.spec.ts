/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PriorityTimerService } from './priority-timer.service';

describe('Service: PriorityTimer', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PriorityTimerService]
    });
  });

  it('should ...', inject([PriorityTimerService], (service: PriorityTimerService) => {
    expect(service).toBeTruthy();
  }));
});
