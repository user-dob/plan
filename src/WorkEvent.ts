import { WorkId } from './Work';

type WorkEventkData = {
    index: number;
    input?: WorkId[];
    output?: WorkId[];
}

export class WorkEvent {
    readonly index: number;
    readonly input: Set<WorkId>;
    readonly output: Set<WorkId>;

    minTime: number;
    maxTime: number;
    
    constructor(data: WorkEventkData) {
        this.index = data.index;
        this.input = new Set(data.input || []);
        this.output = new Set(data.output || []);
    }

    get reservTime(): number {
        return this.maxTime - this.minTime;
    }
}