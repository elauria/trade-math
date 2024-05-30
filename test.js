const assert = require('node:assert');
const tm = require('.')

const tests = [
    [tm.round(3.151416),            3.15],
    [tm.round(0.0018234, 0.001),    0.002],
    [tm.round(0.0018234, 1),        0],
    [tm.round(1350, 100),           1400]   
]

tests.map(([actual, expected], i) => {
    try {
        assert.equal(actual, expected, `Failed at ${i}, actual: ${actual}, expected: ${expected}`);
    } catch (err) {
        console.error(`Error:`, err.message);
    }
});