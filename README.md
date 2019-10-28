# PriorityTimer Service

The limitations of setTimeout and setInterval functions are well documented and there have been attempts to make them "smarter" by adding state support.

The priority timer service takes this effort further and adds the concept of priority, borrowed from real time systems theory.

The service maintains a list of task objects which are periodically executed at precise time intervals depending on their priority.

A task has three members:
* function with zero arguments (action), to execute
* function that returns a boolean, true meaning that the action should be removed from the list and never executed again
* priority value

There are 5 priorities available 
* HIGHEST - 0,
* HIGH - 1, 
* NORMAL - 2, 
* LOW - 3,
* LOWEST - 4.

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
```javascript
priorityTimer.Dispatch(foo);
```  
&nbsp;&nbsp; is equivalent to  
```javascript
setInterval(foo, 25);
```    
```javascript
priorityTimer.Dispatch(foo, priorityTimer.once);
```  
&nbsp;&nbsp; is equivalent to  
```javascript
setTimeout(foo, 25);
```  
```javascript
priorityTimer.Dispatch(foo, priorityTimer.repeat(5), Priority.NORMAL);
```  
&nbsp;&nbsp; execute foo 5 times every 100 ms  
  
```javascript
priorityTimer.Dispatch(foo, ()=>this.testValue===100, Priority.HIGH);
```  
&nbsp;&nbsp; execute foo every 50 ms, until testValue member variable of the calling object is equal to 100.  

## Demo - Inverted Pendulum

![Pendulum](/pendulum.png)

The cart and stick pendulum is a system with two degrees of freedom. If we assume for simplicity that the mass of the cart, the mass and length of the stick, but also the gravity constant are equal to 1, the equations of motion can be written as:

![Equation 1](/equation1.svg)

![Equation 2](/equation2.svg)

F is the control force applied to the cart to bring it back to the stable equilibrium at ![Equilibrium](/equilibrium.svg).

As detailed [here](https://blog.wolfram.com/2011/01/19/stabilized-inverted-pendulum/) the solution to the optimal control problem is given by the feedback rule:

![Control](/control.svg)

The pendulum uses a integration time step of 10 ms and the ui is refreshed every 40 ms. The priority timer service can be configured with a 10 ms "quantum" and two tasks:

* one task with HIGHEST priority (every tick) for system integration
```javascript
    this.priorityTimerService.dispatch(
            () => this.step(), //integrate every every 10 ms
            () => this.isBalanced(), //after the system reaches the desired state, drop the task
            Priority.HIGHEST
        );
```
* a second task executed with NORMAL priority (every 4 ticks) for display updates
```javascript
    this.priorityTimerService.dispatch(
            () => this.display(), //update the display every 40 ms 
            () => this.simulation.isBalanced(), //after the system reaches the desired state, drop the task
            Priority.NORMAL
        );
```
Among the advantages of this aproach we notice that:
* there is no need to use and manage settimeout or setinterval functions
* pause and resume functionality is available at the priority timer service level without involving the simulation object itself.  

A live application that uses this service can be seen [here](https://ldrosu.github.io/PriorityTimer/).
