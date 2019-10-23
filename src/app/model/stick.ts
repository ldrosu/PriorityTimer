export class Stick {   
    public th: number; 
    public th_p: number;
    public th_pp: number;
    constructor() {
        this.reset();
    }
    public integrate(t: number) {
        this.th = this.th + this.th_p * t + this.th_pp * t * t / 2;
        this.th_p = this.th_p + this.th_pp * t;
    }
    public reset() {
        this.th = Math.PI / 2;
        this.th_p = 0;
        this.th_pp = 0;
    }
}