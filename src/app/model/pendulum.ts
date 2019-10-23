import { Cart } from './cart';
import { Stick } from './stick';

export class Pendulum {
    constructor(public cart:Cart, public stick:Stick) {
    }

    public knockStick(angle: number) {
        this.stick.th -= angle * Math.PI / 180;
    }
        
    public solve(f:number){
        var th = this.stick.th;
        var th_p = this.stick.th_p;
        
        var co = Math.cos(th);
        var si = Math.sin(th);
        var x_pp = (co * th_p * th_p - 2 * co * si + 2 * f) / (4 - 2 * si * si);
        var th_pp = -2 * co + 2 * si * x_pp;

        this.cart.x_pp = x_pp;
        this.stick.th_pp = th_pp;
    }
    public integrate(t:number) {
        this.cart.integrate(t);
        this.stick.integrate(t);
    }
    public reset(){
        this.cart.reset();
        this.stick.reset();
    }
}
