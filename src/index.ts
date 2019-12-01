import { Work } from './Work';
import { WorkGraph } from './WorkGraph';
import { WorkEventGraph } from './WorkEventGraph';

const graph = new WorkGraph();
const eventGraph = new WorkEventGraph(graph);

graph.addWork(new Work({id: 1, time: 5}));
graph.addWork(new Work({id: 2, time: 8}));
graph.addWork(new Work({id: 3, time: 3}));
graph.addWork(new Work({id: 4, time: 6, depends: [1]}));
graph.addWork(new Work({id: 5, time: 4, depends: [1]}));
graph.addWork(new Work({id: 6, time: 1, depends: [3]}));
graph.addWork(new Work({id: 7, time: 2, depends: [2, 5, 6]}));
graph.addWork(new Work({id: 8, time: 6, depends: [2, 5, 6]}));
graph.addWork(new Work({id: 9, time: 3, depends: [4, 7]}));
graph.addWork(new Work({id: 10, time: 9, depends: [3]}));
graph.addWork(new Work({id: 11, time: 7, depends: [2, 5, 6, 10]}));

graph.build();
eventGraph.build();
eventGraph.buildMatrix();

for (const row of graph.matrix) {
    console.log(row.join())
}
console.log(eventGraph.events)

// console.log( eventGraph.maxTime(eventGraph.events[3]) )