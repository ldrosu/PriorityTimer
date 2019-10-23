import { Component, OnInit } from '@angular/core';
import { Simulation } from './model/simulation';
import { PriorityTimerService, Priority } from 'src/lib/priority-timer.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Inverted Pendulum';
  //UI 
  uiTheta:string="90";
  uiX:string="0";

  constructor(private priorityTimerService: PriorityTimerService) {
    this.priorityTimerService.quantum=10;
    this.priorityTimerService.timerStopped=()=>this.timerStopped();
  }
 
  simulation:Simulation = new Simulation(this.priorityTimerService);

  ngOnInit(){
    this.start();
  }

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
  
  private timerStopped(){
    this.setButtonState("stopped"); 
  }
  
  //stop the servic e when component destroyed
  ngOnDestroy(): void {
    this.priorityTimerService.stop();
  }

  display() {
    this.uiTheta = (this.simulation.pendulum.stick.th * 180 / Math.PI).toString();
    this.uiX = (this.simulation.pendulum.cart.x * 100).toString();
  }
  
  private setButtonState(state:string) {
    [this.startDisabled,
    this.stopDisabled,
    this.pauseDisabled,
    this.resumeDisabled] = this.buttonDisaledStates[state]; 
  }
  public start(): void {
    this.simulation.start();
    this.priorityTimerService.dispatch(
      () => this.display(),
      () => this.simulation.isBalanced(),
      Priority.NORMAL
    );
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
    this.setButtonState("started");
  }


}
