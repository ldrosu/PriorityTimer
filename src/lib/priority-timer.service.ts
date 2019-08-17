import { Injectable } from '@angular/core';
import { PrioritySequence } from './PrioritySequence';
import { Priority, Task, Tasks } from './Task';
export { Priority } from './Task';

const QUANTUM = 25;

@Injectable({
  providedIn: 'root'
})
export class PriorityTimerService {
  // Interval between ticks (quantum in  real time lingo).
  private _quantum: number = QUANTUM;
  // Order of execution of tasks
  private prioritySequence: PrioritySequence;
  // Collection of tasks scheduled for execution
  private tasks: Tasks;
  // Needed be repeat and repeat and repeatFor helper functions
  private currentTask: Task;
  // Object returned by setTimeout
  private timer: any;
  // State variables initialized to false
  private started = false;
  private paused = false;
  public timerStopped:any;

  constructor() {
    this.prioritySequence = new PrioritySequence();
    this.tasks = new Tasks();
  }
  // Starts the timer if it is not in a started state.
  public start() {
    if (this.started) { return; }
    this.started = true;
    this.timer = setInterval(
      () => this.execute(), this.quantum);
  }
  // Stops the timer and clears all tasks
  public stop() {
    if (this.started) {
      if (this.paused === false) {
        clearInterval(this.timer);
      }
      this.tasks.clear();
      this.started = false;
    }
    this.paused = false;
    //callback end of all tasks
    if (this.timerStopped!=undefined) {
      this.timerStopped();
    }
  }
  // Pauses the timer tasks are kept in waiting and will be
  public pause() {
    if (this.started && (this.paused === false) ) {
      clearInterval(this.timer);
      this.paused = true;
    }
  }
  // Resumes the timer if the etate is started and paused
  public resume() {
    if (this.started && this.paused ) {
      this.timer = setInterval(
        () => this.execute(), this.quantum);
      this.paused = false;
    }
  }
  // Schedules method for execution at the apropriate tick
  // the only required parameter is method, the other two are optional:
  // condition is a lambda that returns true or false
  // priority indicates how often the task will be executed
  // return object can be used to remove the task later if execution is no
  // longer desired
  public dispatch(method: any, condition?: any, priority?: Priority) {
    if (condition === undefined) {
      condition = () => false;
    }
    if (priority === undefined) {
      priority = Priority.HIGHEST;
    }
    if (this.started === false) {
      this.start();
    }
    const task: Task = this.tasks.add(method, condition, priority);
    return task;
  }
  // Explicitly removes a task from execution
  public remove(task: any) {
    this.tasks.remove(task);
  }
  // Executes the all functions on the current tick
  // The highest priority is executed on all ticks first

  private execute() {
    const priority = this.prioritySequence.priority;
    if (priority === Priority.HIGHEST) {
      this.executePriority(Priority.HIGHEST);
    } else {
      this.executePriority(Priority.HIGHEST);
      this.executePriority(priority);
    }
  }

  // Executes task of a certain priority
  // Tasks that meet the exit condition
  // are added to a "remove" list and are removed at the end of the cycle
  private executePriority(priority: Priority) {
    const removeList = [];
    // Iterate through all the tasts
    for (let i = 0; i < this.tasks.length; i++) {
      const task = this.tasks.getTask(i);
      this.currentTask = task;

      if (task.priority === priority) {

        task.method();
        const exit: boolean = task.condition();

        if (exit) {
          removeList.push(i);
        }
      }
    }
    removeList.forEach((i) => (this.tasks).removeAt(i));
    if (this.tasks.length === 0) {
      this.stop();
    }
  }

  // Exit helper functions

  // Exit function that ensures execution a number of times
  public repeat(count: number) {
    if (this.currentTask.count < 0) {
      this.currentTask.count = count - 1;
      return false;
    } else if (this.currentTask.count === 0) {
      return true;
    } else {
      this.currentTask.count--;
      return false;
    }
  }
  // Exit function that ensures execution for a number of milliseconds
  public repeatFor(ms: number) {
    const currentTime = new Date().getTime();
    if (this.currentTask.milliseconds < 0) {
      this.currentTask.milliseconds = currentTime + ms;
      return false;
    } else if (currentTime > this.currentTask.milliseconds) {
      return true;
    } else {
      return false;
    }
  }
  // Exit funtion that always return false
  // The task can still be stopped explicitly or when the timer stops
  public forever() {
    return false;
  }
  // Exit function that returns true
  // The task will be removed after execution
  public once() {
    return true;
  }
  // Period between ticks accessors
  get quantum() { return this._quantum; }
  set quantum(value: number) {
    // minimum value for quantum 10ms (default 25ms)
    if (value > 10) {
      this._quantum = value;
    } else {
      this._quantum = 10;
    }
  }
}
