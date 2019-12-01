import { WorkEvent } from './WorkEvent';
import { WorkGraph } from './WorkGraph';

export class WorkEventGraph {

    events: WorkEvent[];

    matrix: number[][];

    workGraph: WorkGraph;

    constructor(workGraph: WorkGraph) {
        this.workGraph = workGraph;
        this.events = [];
    }

    build() {
        const events = new Map<string, number[]>();
        for (const [index, row] of this.workGraph.matrix.entries()) {
            const key = row.join(''); 
            if (!events.has(key)) {
                events.set(key, []);
            }
            events.get(key).push(index);
        }

        const lastWorks = new Set(this.workGraph.works.map(item => item.id));
        
        events.forEach(value => {
            const row = this.workGraph.matrix[value[0]];
            const input = [];
            const output = [];

            for (const [index, item] of row.entries()) {
                if (item) {
                    const id = this.workGraph.works[index].id;
                    input.push(id);
                    lastWorks.delete(id);
                }
            }

            for (const index of value) {
                output.push(this.workGraph.works[index].id);
            }

            this.events.push(new WorkEvent({
                index: this.events.length,
                input,
                output
            }));            
        })

        this.events.push(new WorkEvent({
            index: this.events.length,
            input: [...lastWorks.values()]
        }));
    }

    buildMatrix() {
        this.matrix = [];
        for (let i = 0; i < this.events.length; i++) {
            this.matrix[i] = [];
            for (let j = 0; j < this.events.length; j++) {
                this.matrix[i][j] = null;
            }
        }

        for (const x of this.events) {
            for (const y of this.events) {
                for (const workId of x.output) {
                    if (y.input.has(workId)) {
                        const work = this.workGraph.getWork(workId);
                        this.matrix[x.index][y.index] = work.time;
                    }
                }
            }
        }
    }

    private calculateMinTime(event: WorkEvent) {
        if (event.index === 0) {
            return 0
        };

        const items = [];
        const row = this.matrix.map(item => item[event.index]);
        for (const [index, item] of row.entries()) {
            if (item !== null) {
                items.push(item + this.minTime(this.events[index]));
            }
        }

        return items.length
            ? Math.max(...items)
            : 0;
    }

    private calculateMaxTime(event: WorkEvent) {
        if (event.index === this.events.length - 1) {
            return this.criticalTime;
        };

        const items = [];
        const row = this.matrix[event.index];
        for (const [index, item] of row.entries()) {
            if (item !== null) {
                console.log(this.maxTime(this.events[index]), item)
                items.push(this.maxTime(this.events[index]) - item);
            }
        }

        return items.length
            ? Math.min(...items)
            : 0;
    }

    minTime(event: WorkEvent): number {
        if (event.minTime == undefined) {
            event.minTime = this.calculateMinTime(event);
        }
        return event.minTime;
    }    

    maxTime(event: WorkEvent): number {
        if (event.maxTime == undefined) {
            event.maxTime = this.calculateMaxTime(event);
        }
        return event.maxTime;
    }

    get startEvent(): WorkEvent {
        return this.events[0];
    }

    get endEvent(): WorkEvent {
        return this.events[this.events.length - 1];
    }

    get criticalTime(): number {
        return this.minTime(this.endEvent);
    }
}