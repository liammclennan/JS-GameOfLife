function seed() {
    return Array.prototype.slice.call(arguments);
}

function same([x,y], [j,k]) {
    return x === j && y === k;
}

// The game state to search for `cell` is passed as the `this` value of the function. 
function contains(cell) {
    return this.some(c => same(c, cell));
}

const sum = ([x,y], [j,k]) => [x+j, y+k];

const getNeighborsOf = ([x,y]) => {
    const neighborDeltas = [
        [-1,1],  [0,1],  [1,1],
        [-1,0],  /* */,  [1,0],
        [-1,-1], [0,-1], [1,-1]
    ];
    return neighborDeltas.map((d) => sum(d, [x,y]));
};

const getLivingNeighbors = (cell, state) => {
    return getNeighborsOf(cell)
        .filter((n) => contains.bind(state)(n));
};

const isAlive = (cell, state) => {
    const livingNeighbors = getLivingNeighbors(cell, state);

    return (
      livingNeighbors.length === 3
      || contains.call(state, cell) && livingNeighbors.length === 2);;
};

const corners = (state = []) => {
    const xs = state.map(([x,_]) => x);
    const ys = state.map(([_,y]) => y);
    return {
        topRight: [Math.max(...xs), Math.max(...ys)],
        bottomLeft: [Math.min(...xs), Math.min(...ys)]
    };
};

const calculateNext = (state) => {
    const {bottomLeft,topRight} = corners(state);
    let result = [];
    for (let y = topRight[1]+1; y >= bottomLeft[1]-1; y--) {
        for (let x = bottomLeft[0]-1; x <= topRight[0]+1; x++) {
            result = result.concat(isAlive([x,y], state) ? [[x,y]] : []);
        }
    }
    return result;
};

const printCell = (cell, state) => {
    return contains.call(state, cell) ? 'x' : '_';
};

const printCells = (state) => {
    const {bottomLeft,topRight} = corners(state);
    for (let y = topRight[1]; y >= bottomLeft[1]; y--) {
        let row = [];
        for (let x = bottomLeft[0]; x <= topRight[0]; x++) {
            row.push(printCell([x,y], state));
        }
        console.log(row.join(''));
    }
};

exports.seed = seed;
exports.same = same;
exports.contains = contains;
exports.sum = sum;
exports.getNeighborsOf = getNeighborsOf;
exports.getLivingNeighbors = getLivingNeighbors;
exports.isAlive = isAlive;
exports.corners = corners;
exports.calculateNext = calculateNext;
exports.printCell = printCell;
exports.printCells = printCells;