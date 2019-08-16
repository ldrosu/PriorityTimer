import {Priority} from './Task';

export class PrioritySequence {
    private _sequence: Array<number> = [];
    // sequence setter to override default
    public set sequence(value: Array<number>) {
        this._sequence = value;
    }
    private index = 0;
    constructor() {
        this.sequence = [1, 2, 1, 3, 1, 2 , 1, 4, 1, 2, 1, 3, 1, 2, 1, 0];
        // equivalent with:
        // this.sequence = this.initSequence(Priority.LOWEST);
    }
    private initSequence(count: number): Array<number> {
        const seq: Array<number> = [];
        const flag = new Array(count).fill(false);
        let i = 0;
        while (true) {
            if (i === count) {
                seq.push(0);
                break;
            }
            for (i = 0; i < count; i++) {
                flag[i] = !flag[i];
                if (flag[i]) {
                    seq.push(i + 1);
                    break;
                }
            }
        }
        return seq;
    }
    // Returns the next element of the priority sequence, at the end of the array returns to first element
    get priority() {
        const retVal = this._sequence[this.index];
        if (++this.index === this._sequence.length) {
            this.index = 0;
        }
        return retVal;
    }
}
