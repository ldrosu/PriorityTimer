import { Controller } from './controller';
import { Pendulum } from './pendulum';
import { Cart } from './cart';
import { Stick } from './stick';
import { PriorityTimerService, Priority } from 'src/lib/priority-timer.service';

export class Simulation {
    pendulum: Pendulum;
    controller: Controller;
    dt: number;
    uiTheta:string="0";
    uiX:string="0";

    constructor(private priorityTimerService:PriorityTimerService) {
        //initialization
        this.dt = 0.02;
        var cart = new Cart();
        var stick = new Stick();
        this.controller = new Controller();
        this.pendulum = new Pendulum(cart, stick); 
    }

    step() {
        var f = this.controller.getForce(this.pendulum.cart.x, this.pendulum.stick.th, this.pendulum.cart.x_p, this.pendulum.stick.th_p);
        //f = 0;
        this.pendulum.solve(f);
        this.pendulum.integrate(this.dt);    
    }

    isBalanced(){
        if (Math.abs(this.pendulum.cart.x) < 0.01 && Math.abs(this.pendulum.stick.th-Math.PI/2) < 0.05)
            return true;
        else
            return false;
    }

    start() {
        this.pendulum.reset();
        this.pendulum.knockStick(30);
        this.priorityTimerService.dispatch(
            () => this.step(),
            () => this.isBalanced(),
            Priority.HIGHEST
          );
    }
}
