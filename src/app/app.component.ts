import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { Priority, PriorityTimerService } from '../lib/priority-timer.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit, OnDestroy {
  private _value1;
  private _value2;
  private _value3;

  public startDisabled = true;
  public stopDisabled = false;
  public pauseDisabled = false;
  public resumeDisabled = true;

  constructor(private priorityTimerService: PriorityTimerService) {
  }

  ngAfterViewInit(): void {
    this.reset();
  }

  ngOnDestroy(): void {
    this.priorityTimerService.stop();
  }

  reset() {
    this.value1 = 0;
    this.value2 = 0;
    this.value3 = 0;
    // Timer initialised
    // Dispatch call with three parameters
    // () => this.value1+=.1 lambda called on appropriate tick
    // () => this.value1 === 100 test for exit
    // Priority.HIGHEST lambda called every tick before anything else
    this.priorityTimerService.dispatch(
      () => this.value1 += 1,
      () => this.value1 === 100,
      Priority.HIGHEST
    );
    this.priorityTimerService.dispatch(
      () => this.value2 += 1,
      () => this.value2 === 100,
      Priority.HIGH
    );
    this.priorityTimerService.dispatch(
      () => this.value3 += 1,
      () => this.value3 === 100,
      Priority.NORMAL
    );
  }

  start(): void {
    this.reset();
    this.priorityTimerService.start();
    this.setButtonStates(true, false, false, true);
  }

  stop(): void {
    this.priorityTimerService.stop();
    this.setButtonStates(false, true, true, true);
  }

  pause(): void {
    this.priorityTimerService.pause();
    this.pauseDisabled = true;
    this.resumeDisabled = false;
  }

  resume(): void {
    this.priorityTimerService.resume();
    this.pauseDisabled = false;
    this.resumeDisabled = true;
  }

  public get value1() {
    return this._value1;
  }

  public set value1(value: number) {
    this._value1 = value;
    if (Math.round(value) === 100) {
      this.resetStatesOnDone();
    }
  }

  public get value2() {
    return this._value2;
  }

  public set value2(value: number) {
    this._value2 = value;
    if (Math.round(value) === 100) {
      this.resetStatesOnDone();
    }
  }

  public get value3() {
    return this._value3;
  }

  public set value3(value: number) {
    this._value3 = value;
    if (Math.round(value) === 100) {
      this.resetStatesOnDone();
    }
  }

  private setButtonStates(
    start: boolean,
    stop: boolean,
    pause: boolean,
    resume: boolean
  ) {
    this.startDisabled = start;
    this.stopDisabled = stop;
    this.pauseDisabled = pause;
    this.resumeDisabled = resume;
  }

  private resetStatesOnDone() {
    if (this.value1 === 100 && this.value2 === 100 && this.value3 === 100) {
      this.setButtonStates(false, true, true, true);
    }
  }
}
