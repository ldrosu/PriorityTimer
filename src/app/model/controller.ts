export class Controller {
    //controller coeficients
    private readonly a:number = 1;
    private readonly b:number = -14.8452;
    private readonly c:number = 5.97415;
    private readonly d:number = -13.7966;
    constructor() {
    }
    public getForce(x:number, th:number, x_p:number, th_p:number):number {
        var f = this.a * x + this.b * (th - Math.PI / 2) + this.c * x_p + this.d * th_p;
        return f;
    }
}
