import { Work, WorkId } from './Work';
import { WorkEvent } from './WorkEvent';

export class WorkGraph {

    readonly works: Work[];

    matrix: number[][];

    readonly idToIndex: Map<WorkId, number>;
    
    constructor() {
        this.works = [];
        this.idToIndex = new Map();
    }

    addWork(work: Work) {
        this.idToIndex.set(work.id, this.works.length);
        this.works.push(work);
    }

    getWork(id: WorkId): Work {
        return this.works[this.idToIndex.get(id)];
    }

    build() {
        this.matrix = [];
        for (let i = 0; i < this.works.length; i++) {
            this.matrix[i] = [];
            for (let j = 0; j < this.works.length; j++) {
                this.matrix[i][j] = 0;
            }
        }

        for (const work of this.works) {
            const index = this.idToIndex.get(work.id);
            for (const dependId of work.depends) {
                const dependIndex = this.idToIndex.get(dependId);
                this.matrix[index][dependIndex] = 1;
            }
        }        
    }    
}
