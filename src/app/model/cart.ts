export class Cart {
    public x:number;
    public x_p:number;
    public x_pp:number;
    
    constructor(){
        this.reset();
    }
    public integrate(t:number){
        this.x = this.x + this.x_p * t + this.x_pp * t * t / 2;
        this.x_p = this.x_p + this.x_pp * t;
    }
    public reset()
    {
        this.x=0;
        this.x_p=0;
        this.x_pp=0;
    }
}



