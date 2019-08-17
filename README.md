# PriorityTimer Service

The limitations of setTimeout and setInterval functions are well documented and there have been attempts to make them "smarter" by adding state support.

The priority timer service takes this effort further and adds the concept of priority, borrowed from real time systems theory.

The service maintains a list of task objects which are periodically executed at precise time intervals depending on their priority.

A task has three members:
    *   function with zero arguments (action), to execute
    *   function that returns a boolean, true meaning that the action should be removed from the list and never executed again
    *   priority value

There are 5 priorities available 
    *   HIGHEST - 0,
    *   HIGH - 1, 
    *   NORMAL - 2, 
    *   LOW - 3,
    *   LOWEST - 4.

## Advantages

The priority timer can be used in cases where different aspects of your application should be processed at different frequencies, for instance if you to refresh different parts of the UI at different rates or if you poll different services at different intervals.

Another potential advantage would be that you don't have to use setTimeout or setInterval in your app at all, just choose the closest match for duration from the given set of priorities.

Thirdly, because the calls are evenly spaced the execution should be "smoother", with less jitter. 

## Usage
 
The Actions are added to the priority timer by the method Dispatch. 
It takes three parameters that correspond to the three members of a task described above.
The last two parameters are optional.

Dispatch returns an object that can be used to remove a task from the list.

The timer starts executing automatically as long as it has at least one task in the list. When the last task is removed the timer stops. If the timer is stopped explicitly, the task list is emtied. 

The timer may also be paused, in this case the tasks stay in the list and the service can be resumed.

## Execution Order

The timer generates a tick every 25 ms, this value (quantum) can be overwritten.
 
The HGHEST priority (0) task actions are executed every tick, 25 ms, HIGH priority ones every other tick, 50 ms, NORMAL every 4th tick or 100 ms, LOW every 8th tick or 200 ms, finnaly LOwEST priority task actions are executed every 16th tick or 400 ms.

The pattern repeats itself every 16 ticks as follows:

Tick    |   0 |  1  |  2  |  3  |  4  |  5  |  6  |  7  |  8  |  9  |  10 |  11 |  12 |  13 |  14 |  15        
--------|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|----
Priority| 0,1 | 0,2 | 0,1 | 0,3 | 0,1 | 0,2 | 0,1 | 0,4 | 0,1 | 0,2 | 0,1 | 0,3 | 0,1 | 0,2 | 0,1 |  0

As an example on tick 7 priority 0 actions are executed first then priority 4.  

Tasks of the same priority are executed sequentially on the same tick in the order they were added to the list.

## Exit helper methods 

Some exit conditions are frequently used and these cases are supprorted by the service as helper methods:
once - ensures a single execution of the action
forever - action is executed until manually stopped
repeat(x) - discards the action after x number of execution
repeatFor(x) - discards the action after x milliseconds

## Examples

priorityTimer.Dispatch(foo);  
    is equivalent to  
setInterval(foo, 25);  
  
priorityTimer.Dispatch(foo, priorityTimer.once);  
    is equivalent to  
setTimeout(foo, 25);  
  
priorityTimer.Dispatch(foo, priorityTimer.repeat(5), Priority.NORMAL);  
    execute foo 5 times every 100 ms  
  
priorityTimer.Dispatch(foo, ()=>this.testValue===100, Priority.HIGH);  
    execute foo every 50 ms, until testValue member variable of the calling object is equal to 100.  

## Demo
A live application that uses this service can be seen [here](https://ldrosu.github.io/PriorityTimer/).




