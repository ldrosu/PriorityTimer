import { Component, OnInit, OnDestroy } from '@angular/core';
import { Priority, PriorityTimerService } from '../lib/priority-timer.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  //progress bar values
  public value1;
  public value2;
  public value3;
  //button disabled values in different system states
  private buttonDisaledStates:{} = {
    "stopped":[false, true,true,true],
    "started":[true,false,false,true],
    "paused":[true,false,true,false]  
  }
  //binding values used to disable buttons in the UI
  public startDisabled = true;
  public stopDisabled = false;
  public pauseDisabled = false;
  public resumeDisabled = true;

  //constructor inject the priorityTimer and set a callback function
  //to handle the notification that all schedules tasks finished 
  constructor(private priorityTimerService: PriorityTimerService) {
    this.priorityTimerService.timerStopped=()=>this.timerStopped();
  }
  private timerStopped(){
    this.setButtonState("stopped"); 
  }
  //Start automatically
  ngOnInit(): void {
    this.reset();
  }
  //stop the servic e when component destroyed
  ngOnDestroy(): void {
    this.priorityTimerService.stop();
  }
  //reset values and restart
  private reset() {
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
  private setButtonState(state:string) {
    [this.startDisabled,
    this.stopDisabled,
    this.pauseDisabled,
    this.resumeDisabled] = this.buttonDisaledStates[state]; 
  }
  public start(): void {
    this.reset();
    this.priorityTimerService.start();
    this.setButtonState("started");
  }

  public stop(): void {
    this.priorityTimerService.stop();
  }

  public pause(): void {
    this.priorityTimerService.pause();
    this.setButtonState("paused");
  }

  public resume(): void {
    this.priorityTimerService.resume();
    this.setButtonState("resumed");
  }


}


