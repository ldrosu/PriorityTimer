// Priority enumeration for practical purposes limited to 5 levels
// HIGHEST priority tasks executed every tick
// HIGH priority tasks executed every other tick
// NORMAL priority tasks executed every forth tick
// LOW priority task executed every eighth tick
// LOWEST priority task executed every sisteenth tick
export enum Priority {
  HIGHEST= 0,
  HIGH= 1,
  NORMAL= 2,
  LOW= 3,
  LOWEST= 4
}
// Encapsulates function to be executed and its conditions
export class Task {
  // function to be executed
  public method: any;
  // exit function executed after method,
  // if it returns true, the task will not be executed again
  public condition: any;
  // dictates how often the task is executed
  public priority: Priority;
  // used by repeat exit function
  public count: number;
  // used by repeatFor exit function
  public milliseconds: number;

  constructor(method: any, condition: any, priority: Priority, count: number= -1, milliseconds: number= -1) {
    this.method = method;
    this.condition = condition;
    this.priority = priority;
    this.count = count;
    this.milliseconds = milliseconds;
  }
}
// Wrapper class of taskArray with better interface
export class Tasks {
    taskArray: Array<Task> = [];
    constructor() {}
    // Add task to the taskArray
    add(method: any, condition: any, priority: Priority) {
        const task: Task = new Task (method, condition, priority);
        this.taskArray.push(task);
        return task;
    }
    // Remove Task from taskArray
    remove(task: Task) {
      const index = this.taskArray.indexOf(task);
      if (index > -1) {
        this.taskArray.splice(index, 1);
      }
    }
    // Remove Task at location from taskArray
    removeAt(index: number) {
        this.taskArray.splice(index, 1);
    }
    // Remove all tasks from taskArray
    clear() {
      this.taskArray.splice(0, this.taskArray.length);
    }
    // Get the task at location
    getTask(index: number) {
      return this.taskArray[index];
    }
    // Get Length of taskArray
    get length() {
        return this.taskArray.length;
    }
}
